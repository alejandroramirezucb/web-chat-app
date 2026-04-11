import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { ProfileCard } from '../../components/ProfileCard/ProfileCard';
import { User } from '../../props/User';
import template from './ProfilePage.hbs?raw';

export class ProfilePage extends Block {
  private _profileCard: ProfileCard;

  constructor(user: User) {
    super();
    this._profileCard = new ProfileCard(user);
  }

  protected children() {
    return {
      profileCard: this._profileCard,
    };
  }

  protected events(): Record<string, EventListener> {
    return {
      'click .profile-page__back': (() =>
        eventBus.emit('nav:chat')) as EventListener,
    };
  }

  protected render() {
    return template;
  }
}
