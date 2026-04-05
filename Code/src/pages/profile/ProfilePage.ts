import { Block } from '../../core/Block';
import template from './ProfilePage.hbs?raw';

export class ProfilePage extends Block {
  constructor() {
    super();
  }

  render() {
    return template;
  }
}
