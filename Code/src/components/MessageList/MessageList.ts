import { Block } from '../../core/Block';
import { CURRENT_USER_ID } from '../../props/User';
import { Message } from '../../props/Message';
import { MessageItem } from '../MessageItem/MessageItem';
import template from './MessageList.hbs?raw';

export class MessageList extends Block {
  declare messages: Message[];

  constructor() {
    super({ messages: [] });
  }

  protected render() {
    return template;
  }

  protected onMount() {
    this._paint();
  }

  update(props: Record<string, unknown>) {
    super.update(props);
    this._paint();
  }

  private _paint() {
    const container = this.element.querySelector('.message-list');

    if (!container) {
      return;
    }

    container.innerHTML = '';

    this.messages.forEach((_message) => {
      const message = new MessageItem({
        message: _message,
        isOwn: _message.senderId === CURRENT_USER_ID,
      });

      container.appendChild(message.element);
    });

    container.scrollTop = container.scrollHeight;
  }
}
