import { Block } from '../../core/Block';
import { Chat } from '../../props/Chat';
import template from './ChatHeader.hbs?raw';

export class ChatHeader extends Block {
  constructor({ chat }: { chat: Chat | null }) {
    super({ chat });
  }

  protected render() {
    return template;
  }
}
