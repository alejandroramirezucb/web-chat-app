import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { findUserByCredentials } from '../../props/User';
import template from './LoginForm.hbs?raw';

export class LoginForm extends Block {
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
      'submit .auth-form': this.onSubmit,
      'click .auth-card__link': this.goRegister,
    };
  }

  private goRegister = () => {
    eventBus.emit('nav:register');
  };

  private inputValue(name: string) {
    const ref = this.refs[name];

    if (!(ref instanceof HTMLInputElement)) {
      return '';
    }

    return ref.value.trim();
  }

  private onSubmit = (event: Event) => {
    event.preventDefault();

    const login = this.inputValue('loginInput');
    const password = this.inputValue('passwordInput');

    const user = findUserByCredentials(login, password);

    if (!user) {
      this.props.error = 'Login o contraseña incorrectos';
      return;
    }

    eventBus.emit('user:logged-in', user.id);
  };
}
