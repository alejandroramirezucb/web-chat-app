import { Block } from '../../core/Block';
import { Message } from '../../props/Message';
import template from './MessageItem.hbs?raw';

export class MessageItem extends Block {
  declare message: Message;
  declare isOwn: boolean;

  constructor({ message, isOwn }) {
    super({ message, isOwn });
  }

  protected render() {
    return template;
  }
}
