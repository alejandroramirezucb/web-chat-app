import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat } from '../../props/Chat';
import { DeleteChatModal } from '../DeleteChatModal/DeleteChatModal';
import template from './ChatHeader.hbs?raw';

export class ChatHeader extends Block {
  declare protected props: {
    chat: Chat | null;
  };

  private readonly deleteChatModal = new DeleteChatModal();
  private dropdownOpen = false;

  constructor({ chat }: { chat: Chat | null }) {
    super({ chat });
  }

  protected render(): string {
    return template;
  }

  protected children(): Record<string, Block> {
    return {
      deleteChatModal: this.deleteChatModal,
    };
  }

  protected events(): Record<string, EventListener> {
    return {
      'click .chat-header__back': this.onBackClick,
      'click .chat-header__menu': this.onMenuClick,
      'click [data-action="add-member"]': this.onAddMember,
      'click [data-action="delete-chat"]': this.onDeleteChat,
    };
  }

  protected onMount(): void {
    document.addEventListener('click', this.onDocumentClick);
  }

  protected onRender(): void {
    this.applyDropdownState();
  }

  private onBackClick = (): void => {
    eventBus.emit('mobile:back');
  };

  private onMenuClick = (event: Event): void => {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    this.applyDropdownState();
  };

  private onDocumentClick = (): void => {
    if (this.dropdownOpen) {
      this.dropdownOpen = false;
      this.applyDropdownState();
    }
  };

  private onAddMember = (): void => {
    this.dropdownOpen = false;
    this.applyDropdownState();
  };

  private onDeleteChat = (): void => {
    this.dropdownOpen = false;
    this.applyDropdownState();
    this.deleteChatModal.open(this.props.chat?.name ?? '');
  };

  private applyDropdownState(): void {
    const dropdown = this.element.querySelector('.chat-header__dropdown');
    if (dropdown) {
      dropdown.classList.toggle('chat-header__dropdown--open', this.dropdownOpen);
    }
  }

  remove(): void {
    document.removeEventListener('click', this.onDocumentClick);
    super.remove();
  }
}
