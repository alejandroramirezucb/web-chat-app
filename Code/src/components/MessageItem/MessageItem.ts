import { Block } from '../../core/Block';
import { Message } from '../../props/Message';
import template from './MessageItem.hbs?raw';

export class MessageItem extends Block {
  constructor({ message, isOwn }: { message: Message; isOwn: boolean }) {
    super({ message, isOwn });
  }

  protected render() {
    return template;
  }
}
