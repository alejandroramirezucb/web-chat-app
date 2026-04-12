import Handlebars from 'handlebars';
import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat } from '../../props/Chat';
import template from './ChatItem.hbs?raw';

Handlebars.registerHelper('firstLetter', (name: string) =>
  name ? name.charAt(0).toUpperCase() : '?',
);

export class ChatItem extends Block {
  declare protected props: {
    chat: Chat;
    isActive: boolean;
    isOwnLastMessage: boolean;
  };

  constructor({ chat, isActive = false }) {
    super({
      chat,
      isActive,
      isOwnLastMessage: chat.lastMessageSender === 'me',
    });
  }

  protected render() {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      click: this.onClick,
    };
  }

  private onClick = () => {
    eventBus.emit('chat:select', this.props.chat.id);
  };
}
