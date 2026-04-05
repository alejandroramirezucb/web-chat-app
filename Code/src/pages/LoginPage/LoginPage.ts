import { Block } from '../../core/Block';
import template from './LoginPage.hbs?raw';

export class LoginPage extends Block {
  constructor() {
    super();
  }

  render() {
    return template;
  }
}
