import { Block } from '../../core/Block';
import { CURRENT_USER_ID } from '../../props/User';
import { Message } from '../../props/Message';
import { MessageItem } from '../MessageItem/MessageItem';
import template from './MessageList.hbs?raw';

export class MessageList extends Block {
  declare protected props: {
    messages: Message[];
  };

  private items: MessageItem[] = [];

  constructor({ messages = [] }: { messages?: Message[] } = {}) {
    super({ messages });
  }

  protected render() {
    return template;
  }

  protected onRender() {
    this.paint();
  }

  private paint() {
    const container = this.element;
    const { messages } = this.props;

    if (!container) {
      return;
    }

    this.items.forEach((item) => {
      item.remove();
    });
    this.items = [];

    container.innerHTML = '';

    if (messages.length > 0) {
      const separator = document.createElement('span');
      separator.className = 'message-list__date';
      separator.textContent = this.formatDate();
      container.appendChild(separator);
    }

    messages.forEach((_message) => {
      const message = new MessageItem({
        message: _message,
        isOwn: _message.senderId === CURRENT_USER_ID,
      });

      this.items.push(message);
      container.appendChild(message.element);
    });

    container.scrollTop = container.scrollHeight;
  }

  private formatDate(): string {
    return 'Hoy';
  }

  remove() {
    this.items.forEach((item) => {
      item.remove();
    });
    this.items = [];
    super.remove();
  }
}
