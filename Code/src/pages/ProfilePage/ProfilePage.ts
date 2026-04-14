import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { ProfileCard } from '../../components/ProfileCard/ProfileCard';
import { User } from '../../props/User';
import template from './ProfilePage.hbs?raw';

export class ProfilePage extends Block {
  declare protected props: {
    user: User;
  };

  constructor(user: User) {
    super({ user });
  }

  protected children(): Record<string, Block> {
    return {
      profileCard: new ProfileCard(this.props.user),
    };
  }

  protected events(): Record<string, EventListener> {
    return {
      'click .profile-page__back': this.goBack,
    };
  }

  private goBack = () => {
    eventBus.emit('nav:chat');
  };

  protected render() {
    return template;
  }
}
