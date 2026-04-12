import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { ProfileAvatar } from '../ProfileAvatar/ProfileAvatar';
import { ProfileFields } from '../ProfileFields/ProfileFields';
import { User } from '../../props/User';
import template from './ProfileCard.hbs?raw';

export class ProfileCard extends Block {
  declare protected props: {
    user: User;
    name: string;
  };

  constructor(user: User) {
    super({ user, name: user.name });
  }

  protected render() {
    return template;
  }

  protected children() {
    const { user } = this.props;

    return {
      profileAvatar: new ProfileAvatar({
        name: user.name,
        avatar: user.avatar,
      }),
      profileFields: new ProfileFields(user),
    };
  }

  protected events(): Record<string, EventListener> {
    return {
      'click .profile-card__action--logout': this.logout,
    };
  }

  private logout = () => {
    eventBus.emit('user:logout');
  };
}
