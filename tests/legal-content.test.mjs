import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const content = JSON.parse(fs.readFileSync('src/app/(legal)/legal-content.json', 'utf8'));
const widget = fs.readFileSync('src/app/hera-widget.tsx', 'utf8');
const document = fs.readFileSync('src/app/(legal)/legal-document.tsx', 'utf8');

test('legal sections remain complete and sequential', () => {
  assert.equal(content.terms.length, 24);
  assert.equal(content.privacy.length, 11);
  for (const sections of [content.terms, content.privacy]) {
    sections.forEach((section, index) => {
      assert(section.heading.startsWith(`${index + 1}. `));
      assert(section.blocks.length > 0);
      for (const block of section.blocks) {
        if (block.type === 'paragraph') assert(block.text.trim());
        else assert(block.items.every(item => item.trim()));
      }
    });
  }
});

test('privacy discloses HERA before the contact request and its processing providers', () => {
  const text = JSON.stringify(content.privacy);
  for (const provider of ['OpenAI', 'Supabase', 'Resend']) assert(text.includes(provider));
  assert(text.includes('incluso antes de que usted solicite contacto'));
  assert(text.includes('extractos de sus mensajes'));
  assert(text.includes('fecha de entrada en vigor'));
  assert.equal(content.privacy[7].blocks[1].items.at(-1), 'para investigar fraude.');
});

test('terms preserve confidentiality duties and identify HERA and PERMIT', () => {
  assert(JSON.stringify(content.terms[3]).includes('no limita las obligaciones'));
  assert(JSON.stringify(content.terms[6]).includes('PERMIT by HEBARO'));
  assert(JSON.stringify(content.terms[7]).includes('no constituyen una cotización definitiva'));
});

test('initial HERA notice is before the composer and links to the real privacy page', () => {
  assert(widget.includes('quickActionsAvailable && <p className="hera-privacy-notice"'));
  assert(widget.includes('aria-describedby={quickActionsAvailable ? "hera-privacy-notice" : undefined}'));
  assert(widget.includes('aria-describedby="hera-privacy-notice" onClick={() => addVisitorMessage(label, service)}'));
  assert(widget.indexOf('id="hera-privacy-notice"') < widget.indexOf('id="hera-message"'));
  assert(widget.includes('<a href="/privacidad">Política de Privacidad</a>'));
  assert(!widget.includes('/politica-de-privacidad'));
  assert(document.includes('dateTime="2026-11-09"'));
  assert(!JSON.stringify(content).includes('Antes de publicar'));
});
