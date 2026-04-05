import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat } from '../../props/Chat';
import { SearchInput } from '../SearchInput/SearchInput';
import { ChatList } from '../ChatList/ChatList';
import template from './ChatSidebar.hbs?raw';

export class ChatSidebar extends Block {
  private _search = new SearchInput();
  private _chatList: ChatList;
  private _chats: Chat[];

  constructor({ chats }) {
    super({ chats });
    this._chats = chats;
    this._chatList = new ChatList({ chats });
  }

  protected render() {
    return template;
  }

  protected children(): Record<string, Block> {
    return {
      searchInput: this._search,
      chatList: this._chatList,
    };
  }

  protected onMount() {
    eventBus.on('search:input', this._onUpdateChatList.bind(this));
  }

  private _onUpdateChatList(query: unknown) {
    const text = String(query).toLowerCase().trim();

    const filtered = text
      ? this._chats.filter((_chat) => _chat.name.toLowerCase().includes(text))
      : this._chats;

    this._chatList.update({ chats: filtered });
  }

  remove() {
    super.remove();
    eventBus.off('search:input', this._onUpdateChatList.bind(this));
  }
}
