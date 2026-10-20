import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createWhatsAppUrl, isSafeHttpsUrl, normalizeWhatsApp, validateContact } from './contact.ts';

test('validation rejects blank name and unknown service without mutating input', () => {
  const fields = { name: '  ', service: 'outro', message: 'Minha mensagem' };
  assert.deepEqual(validateContact(fields, ['corte', 'barba']), {
    name: 'Informe seu nome com pelo menos 2 caracteres.',
    service: 'Escolha o serviço que você deseja.',
  });
  assert.equal(fields.message, 'Minha mensagem');
});

test('validation accepts a selected service and optional message', () => {
  assert.deepEqual(validateContact({ name: 'João', service: 'corte', message: '' }, ['corte']), {});
});

test('validation limits message length', () => {
  assert.ok(validateContact({ name: 'João', service: 'corte', message: 'x'.repeat(1001) }, ['corte']).message);
});

test('WhatsApp rejects missing, malformed or too long phone configuration', () => {
  for (const phone of ['', 'undefined', '[telefone]', '5511abc999999999', '0123456789', '123', '1'.repeat(16)]) {
    assert.equal(normalizeWhatsApp(phone), null);
    assert.equal(createWhatsAppUrl(phone, { name: 'João', service: 'corte', message: '' }, 'Corte'), null);
  }
});

test('WhatsApp accepts formatted international number and preserves accents and special characters', () => {
  const url = createWhatsAppUrl(
    '+55 (11) 99999-9999',
    { name: ' João ', service: 'completo', message: 'Olá & obrigado! #cuidado' },
    'Corte + barba',
  );
  assert.ok(url);
  const parsed = new URL(url);
  assert.equal(parsed.hostname, 'wa.me');
  assert.equal(parsed.pathname, '/5511999999999');
  assert.equal(
    parsed.searchParams.get('text'),
    'Olá! Meu nome é João.\nTenho interesse em: Corte + barba.\nGostaria de consultar os horários disponíveis.\n\nMensagem: Olá & obrigado! #cuidado',
  );
  assert.equal(parsed.hash, '');
});

test('external links require HTTPS without credentials', () => {
  assert.equal(isSafeHttpsUrl('https://maps.google.com/?q=local'), true);
  for (const value of ['', 'javascript:alert(1)', 'http://example.com', 'https://user:pass@example.com']) {
    assert.equal(isSafeHttpsUrl(value), false);
  }
});
