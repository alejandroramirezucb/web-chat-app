import { Block } from '../../core/Block';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import template from './LoginPage.hbs?raw';

export class LoginPage extends Block {
  declare protected props: Record<string, never>;

  protected render() {
    return template;
  }

  protected children(): Record<string, Block> {
    return {
      loginForm: new LoginForm(),
    };
  }
}
