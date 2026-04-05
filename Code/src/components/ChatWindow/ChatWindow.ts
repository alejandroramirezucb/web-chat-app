import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat } from '../../props/Chat';
import { CURRENT_USER_ID, Message } from '../../props/Message';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import { MessageList } from '../MessageList/MessageList';
import { MessageInput } from '../MessageInput/MessageInput';
import template from './ChatWindow.hbs?raw';

export class ChatWindow extends Block {
  declare chat: Chat | null;
  declare messages: Message[];
  private _header: ChatHeader;
  private _messageList: MessageList;
  private _messageInput = new MessageInput();

  constructor() {
    super({ chat: null, messages: [] });
    this._header = new ChatHeader({ chat: null });
    this._messageList = new MessageList();
  }

  protected render() {
    return template;
  }

  protected children(): Record<string, Block> {
    if (!this.chat) {
      return {};
    }

    return {
      chatHeader: this._header,
      messageList: this._messageList,
      messageInput: this._messageInput,
    };
  }

  protected onMount() {
    eventBus.on('message:send', this._onLoadMessage.bind(this));
  }

  private _onLoadMessage(text: unknown) {
    if (!this.chat) {
      return;
    }

    const newMessage: Message = {
      id: Date.now(),
      chatId: this.chat.id,
      senderId: CURRENT_USER_ID,
      text: String(text),
      time: new Date().toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    this._messageList.update({
      messages: [...this._messageList.messages, newMessage],
    });
  }

  update(props: Record<string, unknown>) {
    super.update(props);

    if (this.chat) {
      this._header.update({ chat: this.chat });
      this._messageList.update({ messages: this.messages });
    }
  }

  remove() {
    super.remove();
    eventBus.off('message:send', this._onLoadMessage.bind(this));
  }
}
