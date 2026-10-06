// Run against a local production server and a headless Chromium CDP endpoint.
// All HERA API calls are intercepted in the browser; no email or lead is created.
import assert from 'node:assert/strict';

const origin = process.env.HERA_TEST_ORIGIN || 'http://localhost:3108';
const cdpOrigin = process.env.HERA_TEST_CDP || 'http://localhost:9226';
assert(['localhost', '127.0.0.1'].includes(new URL(origin).hostname));
const tabs = await (await fetch(`${cdpOrigin}/json`)).json();
const socket = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
let nextId = 0;
const pending = new Map();
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (!message.id) return;
  const task = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) task.reject(Error(message.error.message)); else task.resolve(message.result);
});
function command(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => { pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.text);
  return result.result.value;
}
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitFor(expression) {
  for (let attempt = 0; attempt < 100; attempt++) { if (await evaluate(expression)) return; await sleep(100); }
  throw Error(`Timed out: ${expression}`);
}
async function fill(selector, text) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).focus()`);
  await command('Input.insertText', { text });
}

try {
  await command('Page.enable'); await command('Runtime.enable');
  for (const profile of ['desktop', 'mobile', 'standalone']) {
    await command('Emulation.setDeviceMetricsOverride', { width: profile === 'desktop' ? 1366 : 390, height: profile === 'desktop' ? 900 : 844, deviceScaleFactor: 1, mobile: profile !== 'desktop' });
    const injection = await command('Page.addScriptToEvaluateOnNewDocument', { source: `
      Object.defineProperty(navigator, 'standalone', { get: () => ${profile === 'standalone'} });
      window.__heraCalls = []; window.__heraScenario = 'success';
      const originalFetch = window.fetch.bind(window);
      window.fetch = async (url, options) => {
        if (url === '/api/hera/chat') return new Response(JSON.stringify({ message: 'Podemos revisar tu proyecto. ¿Quieres solicitar seguimiento?', readyForContact: true, serviceInterests: ['Software Personalizado'] }), {status:200,headers:{'Content-Type':'application/json'}});
        if (url === '/api/hera/leads') {
          window.__heraCalls.push({url,method:options.method,cache:options.cache,payload:JSON.parse(options.body)});
          await new Promise(resolve => setTimeout(resolve, 700));
          if (window.__heraScenario === 'offline') throw new TypeError('Synthetic offline failure');
          if (window.__heraScenario === 'html') return new Response('<html>Offline fallback</html>',{status:200});
          return new Response(JSON.stringify(window.__heraScenario === 'success' ? {ok:true} : {error:'Private synthetic provider detail'}),{status:window.__heraScenario === 'success' ? 201 : 502,headers:{'Content-Type':'application/json'}});
        }
        return originalFetch(url, options);
      };
    ` });
    for (const scenario of ['success', 'storage-degraded-success', 'email-failure', 'both-failure', 'offline', 'html']) {
      await command('Page.navigate', { url: origin });
      await waitFor('document.readyState === "complete" && !!document.querySelector(".hera-launcher")');
      await sleep(800);
      await evaluate(`window.__heraScenario=${JSON.stringify(scenario.includes('success') ? 'success' : scenario)}; document.querySelector('.hera-launcher').click()`);
      await waitFor('!!document.querySelector(".hera-quick-actions button")');
      await evaluate('document.querySelector(".hera-quick-actions button").click()');
      await waitFor('!!document.querySelector(".hera-contact-choice")');
      await evaluate('document.querySelector(".hera-contact-choice").click()');
      await waitFor('!!document.querySelector(".hera-lead-form")');
      await fill('.hera-lead-form input[name="name"]', 'Synthetic UI visitor');
      await fill('.hera-lead-form input[name="email"]', 'visitor@example.com');
      await evaluate('document.querySelector(".hera-consent input").click()');
      await waitFor('!document.querySelector(".hera-submit").disabled');
      await evaluate('document.querySelector(".hera-submit").click()');
      await waitFor('document.querySelector(".hera-submit")?.textContent.includes("Enviando solicitud")');
      assert(await evaluate('document.querySelector(".hera-submit").disabled'));
      const succeeds = scenario.includes('success');
      await waitFor(succeeds ? '!!document.querySelector(".hera-success")' : '!!document.querySelector(".hera-submit-error")');
      const calls = await evaluate('window.__heraCalls');
      assert.equal(calls.length, 1); assert.equal(calls[0].url, '/api/hera/leads');
      assert.equal(calls[0].method, 'POST'); assert.equal(calls[0].cache, 'no-store');
      assert.equal(calls[0].payload.submission_context, profile === 'standalone' ? 'standalone' : 'browser');
      if (succeeds) assert((await evaluate('document.querySelector(".hera-success").textContent')).includes('¡Listo! Recibimos tu solicitud. Nuestro equipo se comunicará contigo.'));
      else {
        assert.equal(await evaluate('!!document.querySelector(".hera-success")'), false);
        assert.equal(await evaluate(`document.querySelector('.hera-lead-form input[name="name"]').value`), 'Synthetic UI visitor');
        const error = await evaluate('document.querySelector(".hera-submit-error").textContent');
        assert(error.includes('No pudimos enviar tu solicitud.')); assert(!error.includes('Private'));
        assert(await evaluate('document.activeElement === document.querySelector(".hera-submit-error")'));
        await evaluate('document.querySelector(".hera-submit-error a").click()');
        await waitFor('location.pathname === "/consulta"');
      }
      assert.equal(await evaluate('navigator.serviceWorker ? navigator.serviceWorker.getRegistrations().then(r => r.length) : 0'), 0);
      console.log(`${profile}: ${scenario} PASS (mock APIs)`);
    }
    await command('Page.removeScriptToEvaluateOnNewDocument', { identifier: injection.identifier });
  }
} finally { socket.close(); }
