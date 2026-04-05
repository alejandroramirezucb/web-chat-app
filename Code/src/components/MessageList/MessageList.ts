import { Block } from '../../core/Block';
import { CURRENT_USER_ID, Message } from '../../props/Message';
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
      const item = new MessageItem({
        message: _message,
        isOwn: _message.senderId === CURRENT_USER_ID,
      });

      container.appendChild(item.element);
    });

    container.scrollTop = container.scrollHeight;
  }
}
