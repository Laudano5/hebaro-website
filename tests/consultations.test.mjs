import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function evaluate(path, context) {
  const code = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, context);
  return context.exports;
}

const lead = { name: 'Test visitor', email: 'visitor@example.com', description: 'Private message', consent: true };
for (const storageOk of [true, false]) {
  for (const emailOk of [true, false]) {
    test(`storage ${storageOk ? 'success' : 'failure'} + email ${emailOk ? 'success' : 'failure'}`, async () => {
      const logs = [];
      const calls = [];
      class StorageError extends Error {}
      function Resend() {
        this.emails = { send: async (options) => {
          calls.push('email');
          assert.equal(options.to, 'info@hebaro.com');
          assert.equal(options.replyTo, lead.email);
          assert.equal(options.from, 'sender@example.com');
          assert(options.html.includes('NUEVA SOLICITUD DE CONSULTA'));
          assert(options.text.includes(lead.description));
          return emailOk ? { data: { id: 'accepted' } } : { error: { message: 'private provider error' } };
        } };
      }
      const route = evaluate('src/app/api/consultations/route.ts', {
        exports: {}, TextEncoder,
        process: { env: { RESEND_API_KEY: 'test', CONTACT_FROM_EMAIL: 'sender@example.com', CONTACT_TO_EMAIL: 'info@hebaro.com' } },
        console: { info: (...args) => logs.push(args), error: (...args) => logs.push(args) },
        require(name) {
          if (name === 'resend') return { Resend };
          if (name === 'next/server') return { NextResponse: { json: (body, options) => ({ body, ...options }) } };
          if (name.includes('/types')) return { HERA_SERVICES: [] };
          if (name.includes('rate-limit')) return { checkConsultationRateLimit: () => ({ allowed: true }) };
          return { ConsultationStorageError: StorageError, storeConsultationLead: async () => {
            calls.push('storage');
            if (!storageOk) throw Error('private database detail');
          } };
        },
      });
      const response = await route.POST({ headers: new Headers(), text: async () => JSON.stringify(lead) });
      assert.deepEqual(calls, ['storage', 'email']);
      assert.equal(response.status, emailOk ? 201 : 502);
      assert.equal(response.body.ok === true, emailOk);
      assert(logs.some(([event]) => event === `CONSULTATION_STORAGE_${storageOk ? 'SUCCESS' : 'FAILED'}`));
      assert(logs.some(([event]) => event === `CONSULTATION_EMAIL_${emailOk ? 'SUCCESS' : 'FAILED'}`));
      if (!storageOk && emailOk) assert(logs.some(([, data]) => data?.degraded === true));
      assert(!JSON.stringify(logs).includes('private'));
      assert(!JSON.stringify(response).includes('database'));
    });
  }
}

function storageContext(key, fetch) {
  return evaluate('src/lib/consultations/storage.ts', {
    exports: {}, URL, AbortSignal, fetch,
    process: { env: { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: key } },
    require: () => ({}),
  });
}
test('legacy JWT authorization, exact table, bounded request, and secret-key compatibility', async () => {
  for (const key of ['header.payload.signature', 'sb_secret_test']) {
    const { storeConsultationLead } = storageContext(key, async (url, options) => {
      assert.equal(url.pathname, '/rest/v1/hera_leads');
      assert.equal(options.headers.apikey, key);
      assert.equal(options.headers.Authorization, key.includes('.') ? `Bearer ${key}` : undefined);
      assert.equal(options.method, 'POST');
      assert(options.signal);
      return { ok: true };
    });
    await storeConsultationLead(lead);
  }
});
test('Supabase diagnostics preserve code/status but redact lead content and key', async () => {
  const key = 'sb_secret_test';
  const { storeConsultationLead } = storageContext(key, async () => ({
    ok: false, status: 400,
    json: async () => ({ code: '23502', message: `Failed ${lead.name} ${lead.email} ${lead.description} ${key}` }),
  }));
  await assert.rejects(storeConsultationLead(lead), error => {
    assert.equal(error.code, '23502');
    assert.equal(error.status, 400);
    for (const value of [key, lead.name, lead.email, lead.description]) assert(!error.message.includes(value));
    return true;
  });
});
test('storage timeout/network exceptions become a safe diagnostic', async () => {
  const { storeConsultationLead } = storageContext('test', async () => { throw Error('private request detail'); });
  await assert.rejects(storeConsultationLead(lead), error => error.code === 'STORAGE_REQUEST_FAILED' && !error.message.includes('private'));
});
