import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat, chats } from '../../props/Chat';
import { messagesByChatId } from '../../props/Message';
import { ChatSidebar } from '../../components/ChatSidebar/ChatSidebar';
import { ChatWindow } from '../../components/ChatWindow/ChatWindow';
import template from './ChatPage.hbs?raw';

export class ChatPage extends Block {
  private _sidebar = new ChatSidebar({ chats });
  private _window = new ChatWindow();

  constructor() {
    super();
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
    eventBus.on('chat:select', this._onChatSelect.bind(this));
  }

  private _onChatSelect(chatId: unknown) {
    const selected = chats.find((_chat: Chat) => _chat.id === chatId);

    if (!selected) {
      return;
    }

    this._window.update({
      chat: selected,
      messages: messagesByChatId[chatId as number] ?? [],
    });
  }

  remove() {
    eventBus.off('chat:select', this._onChatSelect.bind(this));
    super.remove();
  }
}
