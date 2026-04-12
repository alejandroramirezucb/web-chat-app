import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { findUserByCredentials } from '../../props/User';
import { validate, showFieldError } from '../../utils/validation';
import template from './LoginForm.hbs?raw';

interface LoginFormProps {}

export class LoginForm extends Block {
  declare protected props: LoginFormProps;

  constructor() {
    super({});
  }

  protected render(): string {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'submit .auth-form': this.onSubmit,
      'click .auth-card__link': this.goRegister,
      'blur #login': this.onLoginBlur,
      'blur #password': this.onPasswordBlur,
    };
  }

  private onLoginBlur = (): void => {
    showFieldError(
      this.refs.loginError,
      validate('login', this.inputValue('loginInput')),
    );
  };

  private onPasswordBlur = (): void => {
    showFieldError(
      this.refs.passwordError,
      validate('password', this.rawInputValue('passwordInput')),
    );
  };

  private onSubmit = (event: Event): void => {
    event.preventDefault();

    const loginOrEmail = this.inputValue('loginInput');
    const password = this.rawInputValue('passwordInput');

    const loginErr = validate('login', loginOrEmail);
    const passwordErr = validate('password', password);

    showFieldError(this.refs.loginError, loginErr);
    showFieldError(this.refs.passwordError, passwordErr);

    if (loginErr || passwordErr) return;

    console.log('LoginForm submit:', { loginOrEmail, password });

    const user = findUserByCredentials(loginOrEmail, password);

    if (!user) {
      this.showGeneralError('Login o email o contraseña incorrectos');
      return;
    }

    eventBus.emit('user:logged-in', user.id);
  };

  private goRegister = (): void => {
    eventBus.emit('nav:register');
  };

  private inputValue(refName: string): string {
    const inputElement = this.refs[refName];
    if (!(inputElement instanceof HTMLInputElement)) return '';
    return inputElement.value.trim();
  }

  private rawInputValue(refName: string): string {
    const inputElement = this.refs[refName];
    if (!(inputElement instanceof HTMLInputElement)) return '';
    return inputElement.value;
  }

  private showGeneralError(message: string): void {
    const generalErrorElement = this.refs.generalError;
    if (!generalErrorElement) return;
    generalErrorElement.textContent = message;
    generalErrorElement.classList.toggle(
      'auth-form__error--visible',
      message !== '',
    );
  }
}
