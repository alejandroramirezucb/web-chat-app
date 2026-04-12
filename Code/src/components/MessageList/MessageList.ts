import { Block } from '../../core/Block';
import { CURRENT_USER_ID } from '../../props/User';
import { Message } from '../../props/Message';
import { MessageItem } from '../MessageItem/MessageItem';
import template from './MessageList.hbs?raw';

export class MessageList extends Block {
  declare protected props: {
    messages: Message[];
  };

  constructor({ messages = [] }: { messages?: Message[] } = {}) {
    super({ messages });
  }

  protected render() {
    return template;
  }

  protected onMount() {
    this.paint();
  }

  private paint() {
    const container = this.element.querySelector('.message-list');
    const { messages } = this.props;

    if (!container) {
      return;
    }

    container.innerHTML = '';

    if (messages.length > 0) {
      const separator = document.createElement('span');
      separator.className = 'message-list__date';
      separator.textContent = '19 de Junio';
      container.appendChild(separator);
    }

    messages.forEach((_message) => {
      const message = new MessageItem({
        message: _message,
        isOwn: _message.senderId === CURRENT_USER_ID,
      });

      container.appendChild(message.element);
    });

    container.scrollTop = container.scrollHeight;
  }
}
