import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { ProfileAvatar } from '../ProfileAvatar/ProfileAvatar';
import { ProfileFields } from '../ProfileFields/ProfileFields';
import { ProfileEditForm } from '../ProfileEditForm/ProfileEditForm';
import { AvatarModal } from '../AvatarModal/AvatarModal';
import { User } from '../../props/User';
import template from './ProfileCard.hbs?raw';

interface ProfileCardProps {
  user: User;
  name: string;
  avatarUrl: string;
  showEditForm: boolean;
}

export class ProfileCard extends Block {
  declare protected props: ProfileCardProps;

  private avatarModal: AvatarModal;

  constructor(user: User) {
    super({ user, name: user.name, avatarUrl: user.avatar, showEditForm: false });
    this.avatarModal = new AvatarModal(this.onAvatarSelected);
  }

  protected render(): string {
    return template;
  }

  protected children(): Record<string, Block> {
    const { user, avatarUrl, showEditForm } = this.props;

    const shared = {
      profileAvatar: new ProfileAvatar({
        name: user.name,
        avatar: avatarUrl,
      }),
      avatarModal: this.avatarModal,
    };

    if (showEditForm) {
      return {
        ...shared,
        profileEditForm: new ProfileEditForm(
          user,
          this.onUserSaved,
          this.onEditCancelled,
        ),
      };
    }

    return {
      ...shared,
      profileFields: new ProfileFields(user),
    };
  }

  protected events(): Record<string, EventListener> {
    return {
      'click .profile-card__avatar-wrap': this.openAvatarModal,
      'click .profile-card__action--edit': this.onEditClick,
      'click .profile-card__action--logout': this.logout,
    };
  }

  private openAvatarModal = (): void => {
    this.avatarModal.open();
  };

  private onEditClick = (): void => {
    this.props.showEditForm = true;
  };

  private onUserSaved = (updatedUser: User): void => {
    this.props.user = updatedUser;
    this.props.name = updatedUser.name;
    this.props.showEditForm = false;
  };

  private onEditCancelled = (): void => {
    this.props.showEditForm = false;
  };

  private onAvatarSelected = (dataUrl: string): void => {
    this.props.user.avatar = dataUrl;
    this.props.avatarUrl = dataUrl;

    const avatarImageElement = this.element.querySelector<HTMLImageElement>(
      '.profile-avatar__img',
    );
    const avatarPlaceholderElement = this.element.querySelector<HTMLElement>(
      '.profile-avatar__placeholder',
    );

    if (avatarImageElement) {
      avatarImageElement.src = dataUrl;
    } else if (avatarPlaceholderElement) {
      const avatarImageNode = document.createElement('img');
      avatarImageNode.className = 'profile-avatar__img';
      avatarImageNode.src = dataUrl;
      avatarImageNode.alt = this.props.user.name;
      avatarPlaceholderElement.replaceWith(avatarImageNode);
    }
  };

  private logout = (): void => {
    eventBus.emit('user:logout');
  };
}
