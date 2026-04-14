import { AuthForm } from '../AuthForm/AuthForm';
import { eventBus } from '../../core/EventBus';
import { findUserByCredentials } from '../../props/User';
import { validate, showFieldError } from '../../utils/validation';
import template from './LoginForm.hbs?raw';

export class LoginForm extends AuthForm {
  declare protected props: Record<string, never>;
  declare protected refs: Record<string, HTMLElement> & {
    submitButton?: HTMLElement;
    registerLinkButton?: HTMLElement;
  };

  constructor() {
    super({});
  }

  protected render(): string {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'blur #login': this.onLoginBlur,
      'blur #password': this.onPasswordBlur,
    };
  }

  protected onMount(): void {
    this.refs.submitButton?.addEventListener('click', this.onSubmitClick);
    this.refs.registerLinkButton?.addEventListener('click', this.goRegister);
  }

  remove(): void {
    this.refs.submitButton?.removeEventListener('click', this.onSubmitClick);
    this.refs.registerLinkButton?.removeEventListener('click', this.goRegister);
    super.remove();
  }

  private onSubmitClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    this.onSubmit();
  };

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

  private onSubmit = (): void => {
    const loginOrEmail = this.inputValue('loginInput');
    const password = this.rawInputValue('passwordInput');

    const loginErr = validate('login', loginOrEmail);
    const passwordErr = validate('password', password);

    showFieldError(this.refs.loginError, loginErr);
    showFieldError(this.refs.passwordError, passwordErr);

    if (loginErr || passwordErr) {
      return;
    }

    console.log({ login: loginOrEmail, password });

    const user = findUserByCredentials(loginOrEmail, password);

    if (!user) {
      this.showGeneralError('Login o contraseña incorrectos');
      return;
    }

    eventBus.emit('user:logged-in', user.id);
  };

  private goRegister = (event: Event): void => {
    event.preventDefault();
    eventBus.emit('nav:register');
  };
}
