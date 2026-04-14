import { AuthForm } from '../AuthForm/AuthForm';
import { eventBus } from '../../core/EventBus';
import { findUserByCredentials } from '../../props/User';
import { showFieldError } from '../../utils/validation';
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
    const loginInputValue = this.inputValue('loginInput');
    showFieldError(
      this.refs.loginError,
      loginInputValue ? '' : 'El campo es requerido',
    );
  };

  private onPasswordBlur = (): void => {
    const passwordInputValue = this.rawInputValue('passwordInput');
    showFieldError(
      this.refs.passwordError,
      passwordInputValue ? '' : 'El campo es requerido',
    );
  };

  private onSubmit = (): void => {
    const loginOrEmail = this.inputValue('loginInput');
    const password = this.rawInputValue('passwordInput');

    const loginErr = loginOrEmail ? '' : 'El campo es requerido';
    const passwordErr = password ? '' : 'El campo es requerido';

    showFieldError(this.refs.loginError, loginErr);
    showFieldError(this.refs.passwordError, passwordErr);

    if (loginErr || passwordErr) {
      return;
    }

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
