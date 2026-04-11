import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { ProfileAvatar } from '../ProfileAvatar/ProfileAvatar';
import { ProfileFields } from '../ProfileFields/ProfileFields';
import { User } from '../../props/User';
import template from './ProfileCard.hbs?raw';

export class ProfileCard extends Block {
  private _avatar: ProfileAvatar;
  private _fields: ProfileFields;

  constructor(user: User) {
    super({ name: user.name });
    this._avatar = new ProfileAvatar({ name: user.name, avatar: user.avatar });
    this._fields = new ProfileFields(user);
  }

  protected render() {
    return template;
  }

  protected children() {
    return {
      profileAvatar: this._avatar,
      profileFields: this._fields,
    };
  }

  protected events(): Record<string, EventListener> {
    return {
      'click .profile-card__action--logout': (() =>
        eventBus.emit('user:logout')) as EventListener,
    };
  }
}
