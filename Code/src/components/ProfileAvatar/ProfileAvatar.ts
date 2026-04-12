import { Block } from '../../core/Block';
import template from './ProfileAvatar.hbs?raw';

export class ProfileAvatar extends Block {
  constructor(props: { name?: string; avatar?: string } = {}) {
    super(props);
  }

  protected render() {
    return template;
  }
}
