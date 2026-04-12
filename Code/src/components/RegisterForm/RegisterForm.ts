import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { User, addUser } from '../../props/User';
import template from './RegisterForm.hbs?raw';

export class RegisterForm extends Block {
  declare protected props: {
    error: string;
  };

  constructor() {
    super({ error: '' });
  }

  protected render() {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'submit .auth-form': this.onSubmitForm,
      'click .auth-card__link': this.goLogin,
    };
  }

  private goLogin = () => {
    eventBus.emit('nav:login');
  };

  private inputValue(name: string) {
    const ref = this.refs[name];

    if (!(ref instanceof HTMLInputElement)) {
      return '';
    }

    return ref.value.trim();
  }

  private rawInputValue(name: string) {
    const ref = this.refs[name];

    if (!(ref instanceof HTMLInputElement)) {
      return '';
    }

    return ref.value;
  }

  private onSubmitForm = (event: Event) => {
    event.preventDefault();

    const password = this.inputValue('passwordInput');
    const passwordRepeat = this.inputValue('passwordRepeatInput');

    if (password !== passwordRepeat) {
      this.props.error = 'Las contraseñas no coinciden';
      return;
    }

    const user = this.buildUser();

    addUser(user);
    eventBus.emit('user:registered', user.id);
  };

  private buildUser(): User {
    return {
      id: Date.now(),
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
