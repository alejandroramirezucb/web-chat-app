import { Block } from '../../core/Block';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import template from './LoginPage.hbs?raw';

export class LoginPage extends Block {
  private _loginForm = new LoginForm();

  constructor() {
    super();
  }

  protected render() {
    return template;
  }

  protected children(): Record<string, Block> {
    return {
      loginForm: this._loginForm,
    };
  }
}
