import { Block } from '../../core/Block';
import template from './ProfileFields.hbs?raw';
import { User } from '../../props/User';

export class ProfileFields extends Block {
  constructor(user: User) {
    super(user as unknown as Record<string, unknown>);
  }

  protected render() {
    return template;
  }
}
