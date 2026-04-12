import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat } from '../../props/Chat';
import { ChatItem } from '../ChatItem/ChatItem';
import template from './ChatList.hbs?raw';

export class ChatList extends Block {
  declare protected props: {
    chats: Chat[];
    activeChatId: number | null;
  };

  private items: Map<number, ChatItem> = new Map();

  constructor({ chats, activeChatId = null }) {
    super({ chats, activeChatId });
  }

  protected render() {
    return template;
  }

  protected onMount() {
    this.buildItems();
    eventBus.on('chat:select', this.onChatSelect);
  }

  private onChatSelect = (id: unknown) => {
    if (typeof id !== 'number') {
      return;
    }

    this.props.activeChatId = id;
    this.buildItems();
  };

  private buildItems() {
    const container = this.element.querySelector('.chat-list');
    const { chats, activeChatId } = this.props;

    if (!container) {
      return;
    }

    container.innerHTML = '';
    this.items.clear();

    chats.forEach((chat) => {
      const item = new ChatItem({
        chat,
        isActive: chat.id === activeChatId,
      });

      this.items.set(chat.id, item);
      container.appendChild(item.element);
    });
  }

  remove() {
    super.remove();
    eventBus.off('chat:select', this.onChatSelect);
  }
}
