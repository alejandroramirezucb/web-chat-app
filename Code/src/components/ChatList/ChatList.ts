import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat } from '../../props/Chat';
import { ChatItem } from '../ChatItem/ChatItem';
import template from './ChatList.hbs?raw';

export class ChatList extends Block {
  declare chats: Chat[];
  declare activeChatId: number | null;
  private _items: Map<number, ChatItem> = new Map();

  constructor({ chats, activeChatId = null }) {
    super({ chats, activeChatId });
  }

  protected render() {
    return template;
  }

  protected onMount() {
    this._buildItems();
    eventBus.on('chat:select', this._onActivateChat.bind(this));
  }

  private _onActivateChat(id: unknown) {
    this._items.forEach((item, itemId) =>
      item.update({ isActive: itemId === id }),
    );
  }

  update(props: Record<string, unknown>) {
    super.update(props);
    this._buildItems();
  }

  private _buildItems() {
    const container = this.element.querySelector('.chat-list');

    if (!container) {
      return;
    }

    container.innerHTML = '';
    this._items.clear();

    this.chats.forEach((chat) => {
      const item = new ChatItem({
        chat,
        isActive: chat.id === this.activeChatId,
      });

      this._items.set(chat.id, item);
      container.appendChild(item.element);
    });
  }

  remove() {
    super.remove();
    eventBus.off('chat:select', this._onActivateChat.bind(this));
  }
}
