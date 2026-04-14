import { AuthForm } from '../AuthForm/AuthForm';
import { eventBus } from '../../core/EventBus';
import {
  User,
  addUser,
  findUserByLogin,
  findUserByEmail,
  users,
} from '../../props/User';
import { validate, showFieldError } from '../../utils/validation';
import template from './RegisterForm.hbs?raw';

interface RegisterFieldRefs {
  emailError: HTMLElement;
  loginError: HTMLElement;
  nameError: HTMLElement;
  lastNameError: HTMLElement;
  phoneError: HTMLElement;
  passwordError: HTMLElement;
  passwordRepeatError: HTMLElement;
  generalError: HTMLElement;
  submitButton?: HTMLElement;
  loginLinkButton?: HTMLElement;
}

export class RegisterForm extends AuthForm {
  declare protected props: Record<string, never>;
  declare protected refs: Record<string, HTMLElement> & RegisterFieldRefs;

  constructor() {
    super({});
  }

  protected render(): string {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'blur #email': this.onEmailBlur,
      'blur #login': this.onLoginBlur,
      'blur #name': this.onNameBlur,
      'blur #last_name': this.onLastNameBlur,
      'blur #phone': this.onPhoneBlur,
      'blur #password': this.onPasswordBlur,
      'blur #password_repeat': this.onPasswordRepeatBlur,
    };
  }

  protected onMount(): void {
    this.refs.submitButton?.addEventListener('click', this.onSubmitClick);
    this.refs.loginLinkButton?.addEventListener('click', this.goLogin);
  }

  remove(): void {
    this.refs.submitButton?.removeEventListener('click', this.onSubmitClick);
    this.refs.loginLinkButton?.removeEventListener('click', this.goLogin);
    super.remove();
  }

  private onSubmitClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    this.onSubmit();
  };

  private onEmailBlur = (): void => {
    showFieldError(
      this.refs.emailError,
      validate('email', this.inputValue('emailInput')),
    );
  };

  private onLoginBlur = (): void => {
    showFieldError(
      this.refs.loginError,
      validate('login', this.inputValue('loginInput')),
    );
  };

  private onNameBlur = (): void => {
    showFieldError(
      this.refs.nameError,
      validate('name', this.inputValue('nameInput')),
    );
  };

  private onLastNameBlur = (): void => {
    showFieldError(
      this.refs.lastNameError,
      validate('last_name', this.inputValue('lastNameInput')),
    );
  };

  private onPhoneBlur = (): void => {
    showFieldError(
      this.refs.phoneError,
      validate('phone', this.inputValue('phoneInput')),
    );
  };

  private onPasswordBlur = (): void => {
    showFieldError(
      this.refs.passwordError,
      validate('password', this.rawInputValue('passwordInput')),
    );
  };

  private onPasswordRepeatBlur = (): void => {
    const password = this.rawInputValue('passwordInput');
    const repeatedPassword = this.rawInputValue('passwordRepeatInput');
    const passwordRepeatError =
      repeatedPassword !== password ? 'Las contraseñas no coinciden' : '';
    showFieldError(this.refs.passwordRepeatError, passwordRepeatError);
  };

  private onSubmit = (): void => {
    const email = this.inputValue('emailInput');
    const login = this.inputValue('loginInput');
    const name = this.inputValue('nameInput');
    const lastName = this.inputValue('lastNameInput');
    const phone = this.inputValue('phoneInput');
    const password = this.rawInputValue('passwordInput');
    const passwordRepeat = this.rawInputValue('passwordRepeatInput');

    const emailErr = validate('email', email);
    const loginErr = validate('login', login);
    const nameErr = validate('name', name);
    const lastNameErr = validate('last_name', lastName);
    const phoneErr = validate('phone', phone);
    const passwordErr = validate('password', password);
    const passwordRepeatErr =
      password !== passwordRepeat ? 'Las contraseñas no coinciden' : '';

    showFieldError(this.refs.emailError, emailErr);
    showFieldError(this.refs.loginError, loginErr);
    showFieldError(this.refs.nameError, nameErr);
    showFieldError(this.refs.lastNameError, lastNameErr);
    showFieldError(this.refs.phoneError, phoneErr);
    showFieldError(this.refs.passwordError, passwordErr);
    showFieldError(this.refs.passwordRepeatError, passwordRepeatErr);

    if (
      emailErr ||
      loginErr ||
      nameErr ||
      lastNameErr ||
      phoneErr ||
      passwordErr ||
      passwordRepeatErr
    ) {
      return;
    }

    if (findUserByLogin(login)) {
      this.showGeneralError('El login ya está en uso');
      return;
    }

    if (findUserByEmail(email)) {
      this.showGeneralError('El correo ya está registrado');
      return;
    }

    const user = this.buildUser();
    addUser(user);

    console.log({
      email,
      login,
      name,
      last_name: lastName,
      phone,
      password,
    });

    eventBus.emit('user:registered', user.id);
  };

  private goLogin = (event: Event): void => {
    event.preventDefault();
    eventBus.emit('nav:login');
  };

  private buildUser(): User {
    return {
      id: users.length + 1,
      login: this.inputValue('loginInput'),
      password: this.rawInputValue('passwordInput'),
      name: this.inputValue('nameInput'),
      last_name: this.inputValue('lastNameInput'),
      avatar: '',
      phone: this.inputValue('phoneInput'),
      email: this.inputValue('emailInput'),
    };
  }
}
