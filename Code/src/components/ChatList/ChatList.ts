import { Block } from '../../core/Block';
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
  }

  private buildItems() {
    const container = this.element;
    const { chats, activeChatId } = this.props;

    if (!container) {
      return;
    }

    container.innerHTML = '';
    this.items = new Map();

    chats.forEach((chat) => {
      const item = new ChatItem({
        chat,
        isActive: chat.id === activeChatId,
      });

      this.items.set(chat.id, item);
      container.appendChild(item.element);
    });
  }

}
