import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import template from './DeleteChatModal.hbs?raw';

export class DeleteChatModal extends Block {
  declare protected props: {
    chatName: string;
  };

  constructor() {
    super({ chatName: '' });
  }

  protected render(): string {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'click .delete-chat-modal__overlay': this.close,
      'click .delete-chat-modal__cancel': this.close,
      'click .delete-chat-modal__confirm': this.onConfirm,
    };
  }

  open(chatName: string): void {
    this.props.chatName = chatName;
    this.element.classList.add('delete-chat-modal--open');
    this.element.setAttribute('aria-hidden', 'false');
  }

  close = (): void => {
    this.element.classList.remove('delete-chat-modal--open');
    this.element.setAttribute('aria-hidden', 'true');
  };

  private onConfirm = (): void => {
    eventBus.emit('chat:delete');
    this.close();
  };
}
