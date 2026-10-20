export type ContactFields = {
  name: string;
  service: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export function validateContact(
  fields: ContactFields,
  serviceIds: readonly string[],
): ContactErrors {
  const errors: ContactErrors = {};
  if (fields.name.trim().length < 2) {
    errors.name = 'Informe seu nome com pelo menos 2 caracteres.';
  } else if (fields.name.trim().length > 100) {
    errors.name = 'Use até 100 caracteres no nome.';
  }
  if (!serviceIds.includes(fields.service)) {
    errors.service = 'Escolha o serviço que você deseja.';
  }
  if (fields.message.trim().length > 1000) {
    errors.message = 'Sua mensagem pode ter até 1.000 caracteres.';
  }
  return errors;
}

export function normalizeWhatsApp(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed || !/^\+?[\d\s()-]+$/.test(trimmed)) return null;
  const digits = trimmed.replace(/\D/g, '');
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;
}

export function createWhatsAppUrl(
  phone: string,
  fields: ContactFields,
  serviceName: string,
): string | null {
  const number = normalizeWhatsApp(phone);
  if (!number) return null;
  const lines = [
    `Olá! Meu nome é ${fields.name.trim()}.`,
    `Tenho interesse em: ${serviceName}.`,
    'Gostaria de consultar os horários disponíveis.',
  ];
  if (fields.message.trim()) lines.push(`\nMensagem: ${fields.message.trim()}`);
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function isSafeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}
