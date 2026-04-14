import { Block } from '../../core/Block';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';
import template from './RegisterPage.hbs?raw';

export class RegisterPage extends Block {
  declare protected props: Record<string, never>;

  protected render() {
    return template;
  }

  protected children(): Record<string, Block> {
    return {
      registerForm: new RegisterForm(),
    };
  }
}
