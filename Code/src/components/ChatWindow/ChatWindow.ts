import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat } from '../../props/Chat';
import { CURRENT_USER_ID } from '../../props/User';
import { Message } from '../../props/Message';
import { ChatHeader } from '../ChatHeader/ChatHeader';
import { MessageList } from '../MessageList/MessageList';
import { MessageInput } from '../MessageInput/MessageInput';
import template from './ChatWindow.hbs?raw';

export class ChatWindow extends Block {
  declare protected props: {
    chat: Chat | null;
    messages: Message[];
  };

  constructor({
    chat = null,
    messages = [],
  }: { chat?: Chat | null; messages?: Message[] } = {}) {
    super({ chat, messages });
  }

  protected render() {
    return template;
  }

  protected children(): Record<string, Block> {
    const { chat, messages } = this.props;

    if (!chat) {
      return {};
    }

    return {
      chatHeader: new ChatHeader({ chat }),
      messageList: new MessageList({ messages }),
      messageInput: new MessageInput(),
    };
  }

  protected onMount() {
    eventBus.on('message:send', this.onMessageSend);
  }

  private onMessageSend = (text: unknown) => {
    const { chat, messages } = this.props;

    if (!chat || !String(text).trim()) {
      return;
    }

    const newMessage = this.buildMessage(text, chat);

    this.props.messages = [...messages, newMessage];
  };

  private buildMessage(text: unknown, chat: Chat): Message {
    return {
      id: Date.now(),
      chatId: chat.id,
      senderId: CURRENT_USER_ID,
      text: String(text),
      time: new Date().toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  }

  remove() {
    super.remove();
    eventBus.off('message:send', this.onMessageSend);
  }
}
