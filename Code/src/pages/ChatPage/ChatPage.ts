import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat, getChatsByUserId } from '../../props/Chat';
import { messagesByChatId } from '../../props/Message';
import { ChatSidebar } from '../../components/ChatSidebar/ChatSidebar';
import { ChatWindow } from '../../components/ChatWindow/ChatWindow';
import template from './ChatPage.hbs?raw';

export class ChatPage extends Block {
  private _userChats: Chat[];
  private _sidebar: ChatSidebar;
  private _window: ChatWindow;

  constructor(userId: number) {
    super();
    this._userChats = getChatsByUserId(userId);
    this._sidebar = new ChatSidebar({ chats: this._userChats });
    this._window = new ChatWindow();
  }

  protected render() {
    return template;
  }

  protected children(): Record<string, Block> {
    return {
      chatSidebar: this._sidebar,
      chatWindow: this._window,
    };
  }

  protected onMount() {
    eventBus.on('chat:select', this._onChatSelect);
  }

  private _onChatSelect = (chatId: unknown) => {
    const selected = this._userChats.find((_chat) => _chat.id === chatId);

    if (!selected) {
      return;
    }

    this._window.update({
      chat: selected,
      messages: messagesByChatId[chatId as number] ?? [],
    });
  };

  remove() {
    super.remove();
    eventBus.off('chat:select', this._onChatSelect);
  }
}
