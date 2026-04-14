import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat } from '../../props/Chat';
import { SearchInput } from '../SearchInput/SearchInput';
import { ChatList } from '../ChatList/ChatList';
import template from './ChatSidebar.hbs?raw';

export class ChatSidebar extends Block {
  declare protected props: {
    chats: Chat[];
    allChats: Chat[];
    activeChatId: number | null;
    searchQuery: string;
  };

  constructor({
    chats,
    activeChatId = null,
  }: {
    chats: Chat[];
    activeChatId?: number | null;
  }) {
    super({ chats, allChats: chats, activeChatId, searchQuery: '' });
  }

  protected render() {
    return template;
  }

  protected children(): Record<string, Block> {
    return {
      searchInput: new SearchInput({ value: this.props.searchQuery }),
      chatList: new ChatList({
        chats: this.props.chats,
        activeChatId: this.props.activeChatId,
      }),
    };
  }

  protected events(): Record<string, EventListener> {
    return {
      'click .chat-sidebar__profile-link': this.goProfile,
    };
  }

  private goProfile = () => {
    eventBus.emit('nav:profile');
  };

  protected onMount() {
    eventBus.on('search:input', this.onSearchInput);
  }

  private onSearchInput = (query: unknown) => {
    const rawText = String(query);
    const text = rawText.toLowerCase().trim();
    const allChats = this.props.allChats;

    const filtered = text
      ? allChats.filter((_chat) => _chat.name.toLowerCase().includes(text))
      : allChats;

    this.props.searchQuery = rawText;
    this.props.chats = filtered;
  };

  remove() {
    super.remove();
    eventBus.off('search:input', this.onSearchInput);
  }
}
