export interface FieldRule {
  pattern: RegExp;
  message: string;
}

export type ValidatableField =
  | 'name'
  | 'last_name'
  | 'login'
  | 'email'
  | 'password'
  | 'phone'
  | 'message';

const FIELD_RULES: Record<ValidatableField, FieldRule> = {
  name: {
    pattern: /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯёЁ-]*$/,
    message:
      'Primera letra mayúscula, solo letras (latinas o cirílicas) y guion',
  },
  last_name: {
    pattern: /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯёЁ-]*$/,
    message:
      'Primera letra mayúscula, solo letras (latinas o cirílicas) y guion',
  },
  login: {
    pattern: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
    message:
      '3–20 caracteres, letras latinas. Puede contener números (no solo números), guion y guion bajo',
  },
  email: {
    pattern: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z][a-zA-Z0-9.]*\.[a-zA-Z]{2,}$/,
    message: 'Formato de correo electrónico inválido',
  },
  password: {
    pattern: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
    message: '8–40 caracteres, al menos una letra mayúscula y un número',
  },
  phone: {
    pattern: /^\+?[0-9]{10,15}$/,
    message: '10–15 dígitos, puede comenzar con +',
  },
  message: {
    pattern: /\S/,
    message: 'El mensaje no puede estar vacío',
  },
};

export function validate(field: ValidatableField, value: string): string {
  const rule = FIELD_RULES[field];
  return rule.pattern.test(value) ? '' : rule.message;
}

export function showFieldError(
  fieldErrorElement: HTMLElement | null,
  errorMessage: string,
): void {
  if (!fieldErrorElement) return;
  fieldErrorElement.textContent = errorMessage;
  fieldErrorElement.classList.toggle(
    'field-error--visible',
    errorMessage !== '',
  );
}
