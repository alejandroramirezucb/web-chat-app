import { Block } from '../../core/Block';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';
import template from './RegisterPage.hbs?raw';

export class RegisterPage extends Block {
  private _registerForm = new RegisterForm();

  constructor() {
    super();
  }

  protected render() {
    return template;
  }

  protected children(): Record<string, Block> {
    return {
      registerForm: this._registerForm,
    };
  }
}
