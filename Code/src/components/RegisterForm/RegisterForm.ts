import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { User, addUser } from '../../props/User';
import template from './RegisterForm.hbs?raw';

export class RegisterForm extends Block {
  constructor() {
    super({ error: '' });
  }

  protected render() {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'submit .auth-form': ((event: Event) =>
        this._onSubmitForm(event)) as EventListener,
      'click .auth-card__link': (() =>
        eventBus.emit('nav:login')) as EventListener,
    };
  }

  private _onSubmitForm(event: Event) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const password = (formData.get('password') as string ?? '').trim();
    const passwordRepeat = (formData.get('password_repeat') as string ?? '').trim();

    if (password !== passwordRepeat) {
      this.update({ error: 'Las contraseñas no coinciden' });
      return;
    }

    const user = this._buildUser(formData);

    addUser(user);
    eventBus.emit('user:registered', user.id);
  }

  private _buildUser(formData: FormData): User {
    return {
      id: Date.now(),
      login: formData.get('login') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      last_name: formData.get('last_name') as string,
      avatar: (formData.get('avatar') as string) ?? '',
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
    };
  }
}
