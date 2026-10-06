import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function evaluate(filename, context) {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, context);
  return context.exports;
}

const lead = {
  name: 'Synthetic visitor', email: 'visitor@example.com', phone: null,
  company: null, service_interest: 'Software Personalizado',
  current_process: null, requirements: null,
  visitor_messages: ['Private synthetic inventory context'], consent: true, website: '',
};
class StorageError extends Error { constructor(code, status) { super(code); this.code = code; this.status = status; } }
class EmailError extends Error { constructor(code) { super(code); this.code = code; } }

function routeContext({ storageOk = true, emailOk = true, summaryOk = true } = {}) {
  const logs = [], calls = [];
  let storedLead;
  const route = evaluate('src/app/api/hera/leads/route.ts', {
    exports: {}, TextEncoder, Headers,
    console: Object.fromEntries(['info', 'warn', 'error'].map(level => [level, (...args) => logs.push(args)])),
    require(name) {
      if (name === 'node:crypto') return { randomUUID: () => 'synthetic-request-id' };
      if (name === 'next/server') return { NextResponse: { json: (body, options) => ({ body, ...options }) } };
      if (name.endsWith('/types')) return { HERA_SERVICES: ['IA y Automatización', 'Software Personalizado', 'Integración de Sistemas', 'Capacitación & Upskilling'] };
      if (name.endsWith('/rate-limit')) return { checkLeadRateLimit: () => ({ allowed: true }) };
      if (name.endsWith('/openai')) return { generateHeraLeadSummary: async () => {
        if (!summaryOk) throw Error('Private provider detail');
        return { goal: 'Inventory', currentProcess: '', painPoints: '', systemsTools: '', requirements: '', constraints: '', desiredOutcome: '', followUpNotes: '', serviceInterests: [] };
      } };
      if (name.endsWith('/supabase-leads')) return { HeraStorageError: StorageError, insertHeraLead: async (value) => {
        storedLead = value; calls.push('storage');
        if (!storageOk) throw new StorageError('23502', 400);
      } };
      if (name.endsWith('/lead-email')) return { HeraEmailError: EmailError, sendHeraLeadEmail: async (value) => {
        calls.push('email'); assert.equal(value, storedLead);
        if (!emailOk) throw new EmailError('PROVIDER_NOT_ACCEPTED');
      } };
      throw Error('Unexpected dependency');
    },
  });
  return { logs, calls, route, getStoredLead: () => storedLead };
}

const request = payload => ({ headers: new Headers(), text: async () => JSON.stringify(payload) });
for (const submission_context of ['browser', 'standalone']) {
  for (const storageOk of [true, false]) for (const emailOk of [true, false]) {
    test(`${submission_context}: storage=${storageOk}, email=${emailOk}`, async () => {
      const { route, logs, calls, getStoredLead } = routeContext({ storageOk, emailOk });
      const response = await route.POST(request({ ...lead, submission_context }));
      assert.deepEqual(calls, ['storage', 'email']);
      assert.equal(response.status, emailOk ? 201 : 502);
      assert.equal(response.body.ok === true, emailOk);
      assert.equal(response.headers['Cache-Control'], 'no-store');
      assert.equal(getStoredLead().source, 'HERA');
      assert.equal(getStoredLead().service_interest, lead.service_interest);
      assert(logs.some(([event]) => event === `HERA_STORAGE_${storageOk ? 'SUCCESS' : 'FAILED'}`));
      assert(logs.some(([event]) => event === `HERA_EMAIL_${emailOk ? 'SUCCESS' : 'FAILED'}`));
      assert.equal(logs.some(([event]) => event === 'HERA_LEAD_COMPLETED'), emailOk);
      if (!storageOk && emailOk) assert(logs.some(([, data]) => data.degraded === true));
      assert(!JSON.stringify(logs).includes(lead.email));
      assert(!JSON.stringify(logs).includes(lead.visitor_messages[0]));
    });
  }
}

test('summary failure still preserves visitor context and delivers notification', async () => {
  const { route, getStoredLead } = routeContext({ summaryOk: false });
  const response = await route.POST(request(lead));
  assert.equal(response.status, 201);
  assert(getStoredLead().conversation_summary.includes(lead.visitor_messages[0]));
});

test('invalid or honeypot leads fail before any write/email, with safe stage logging', async () => {
  for (const payload of [
    { ...lead, consent: false }, { ...lead, website: 'bot' },
    { ...lead, email: 'bad', phone: null }, { ...lead, company: 'x'.repeat(201) },
    { ...lead, visitor_messages: [lead.visitor_messages[0], {}] },
  ]) {
    const { route, logs, calls } = routeContext();
    assert.equal((await route.POST(request(payload))).status, 400);
    assert.equal(calls.length, 0);
    assert(logs.some(([event]) => event === 'HERA_LEAD_VALIDATION_FAILED'));
  }
});

test('HERA storage uses public.hera_leads, bounded requests, correct legacy/new key auth', async () => {
  for (const key of ['header.payload.signature', 'sb_secret_synthetic']) {
    const storage = evaluate('src/lib/hera/supabase-leads.ts', {
      exports: {}, URL, AbortSignal,
      process: { env: { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: key } },
      require: () => ({}),
      fetch: async (url, options) => {
        assert.equal(url.pathname, '/rest/v1/hera_leads');
        assert.equal(options.headers['Content-Profile'], 'public');
        assert.equal(options.headers.apikey, key);
        assert.equal(options.headers.Authorization, key.includes('.') ? `Bearer ${key}` : undefined);
        assert.equal(options.cache, 'no-store'); assert(options.signal);
        return { ok: true };
      },
    });
    await storage.insertHeraLead(lead);
  }
});

test('storage diagnostics never echo private provider payloads', async () => {
  const storage = evaluate('src/lib/hera/supabase-leads.ts', {
    exports: {}, URL, AbortSignal, require: () => ({}),
    process: { env: { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'synthetic' } },
    fetch: async () => ({ ok: false, status: 400, json: async () => ({ code: '23502', message: lead.visitor_messages[0], details: lead.email }) }),
  });
  await assert.rejects(storage.insertHeraLead(lead), error => error.code === '23502' && error.status === 400 && !error.message.includes('Private'));
});

test('storage configuration and network errors are safe and bounded', async () => {
  for (const configured of [false, true]) {
    const storage = evaluate('src/lib/hera/supabase-leads.ts', {
      exports: {}, URL, AbortSignal, require: () => ({}),
      process: { env: configured ? { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'synthetic' } : {} },
      fetch: async () => { throw Error(lead.visitor_messages[0]); },
    });
    await assert.rejects(storage.insertHeraLead(lead), error => error.code === (configured ? 'STORAGE_REQUEST_FAILED' : 'STORAGE_NOT_CONFIGURED'));
  }
});

test('HERA email uses existing configured sender/recipient, Reply-To, escaped content, provider acceptance', async () => {
  for (const mode of ['accepted', 'rejected', 'empty', 'network']) {
    const email = evaluate('src/lib/hera/lead-email.ts', {
      exports: {}, AbortSignal,
      process: { env: { RESEND_API_KEY: 'synthetic', CONTACT_FROM_EMAIL: 'sender@example.com', CONTACT_TO_EMAIL: 'info@hebaro.com' } },
      require(name) {
        if (name !== 'resend') return {};
        return { Resend: class { constructor() { this.emails = { send: async (options, requestOptions) => {
          assert.equal(options.from, 'sender@example.com'); assert.equal(options.to, 'info@hebaro.com');
          assert.equal(options.replyTo, lead.email); assert(requestOptions.signal);
          assert(options.html.includes('&lt;script&gt;')); assert(!options.html.includes('<script>'));
          if (mode === 'network') throw Error('private upstream content');
          return { data: mode === 'accepted' ? { id: 'synthetic-id' } : null, error: mode === 'rejected' ? { message: 'private' } : null };
        } }; } } };
      },
    });
    const payload = { ...lead, conversation_summary: '<script>Private context</script>', consent_at: '2026-10-06', source: 'HERA' };
    if (mode === 'accepted') await email.sendHeraLeadEmail(payload);
    else await assert.rejects(email.sendHeraLeadEmail(payload), error => !error.message.includes('private'));
  }
});

test('client requires explicit JSON success, uses same-origin POST without cache, preserves safe errors', async () => {
  for (const mode of ['success', 'error', 'html', 'empty', 'network']) {
    const client = evaluate('src/lib/hera/submit-lead.ts', {
      exports: {}, AbortController, setTimeout, clearTimeout,
      fetch: async (url, options) => {
        assert.equal(url, '/api/hera/leads'); assert.equal(options.method, 'POST');
        assert.equal(options.cache, 'no-store'); assert.equal(options.credentials, 'same-origin');
        assert(options.signal); assert.equal(JSON.parse(options.body).consent, true);
        if (mode === 'network') throw Error('Private exception');
        return { ok: mode !== 'error', json: async () => {
          if (mode === 'html') throw Error('HTML fallback');
          return mode === 'success' ? { ok: true } : { error: 'Private backend message' };
        } };
      },
    });
    if (mode === 'success') await client.submitHeraLead(lead);
    else await assert.rejects(client.submitHeraLead(lead), error => error.message === client.HERA_LEAD_FAILURE_MESSAGE);
  }
});

test('client timeout aborts a stalled submission and leaves a retryable safe error', async () => {
  let timeoutCallback, cleared = false;
  const client = evaluate('src/lib/hera/submit-lead.ts', {
    exports: {}, AbortController,
    setTimeout(callback, ms) { assert.equal(ms, 55000); timeoutCallback = callback; return 1; },
    clearTimeout() { cleared = true; },
    fetch: async (_url, options) => new Promise((_resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(Error('Aborted')));
      timeoutCallback();
    }),
  });
  await assert.rejects(client.submitHeraLead(lead), error => error.message === client.HERA_LEAD_FAILURE_MESSAGE);
  assert(cleared);
});
