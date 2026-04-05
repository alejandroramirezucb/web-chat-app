import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { findUserByCredentials } from '../../props/User';
import template from './LoginForm.hbs?raw';

export class LoginForm extends Block {
  constructor() {
    super({ error: '' });
  }

  protected render() {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'submit .auth-form': ((event: Event) =>
        this._onSubmit(event)) as EventListener,
      'click .auth-card__link': (() =>
        eventBus.emit('nav:register')) as EventListener,
    };
  }

  private _onSubmit(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const login = (
      formData.get('login') as string ?? ''
    ).trim();

    const password = (
      formData.get('password') as string ?? ''
    ).trim();

    const user = findUserByCredentials(login, password);

    if (!user) {
      this.update({ error: 'Login o contraseña incorrectos' });
      return;
    }

    eventBus.emit('user:logged-in', user.id);
  }
}
