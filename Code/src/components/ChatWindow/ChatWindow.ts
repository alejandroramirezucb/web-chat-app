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

  private onMessageSend = (payload: unknown) => {
    const { chat, messages } = this.props;
    if (!chat) return;

    const time = new Date().toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
    });

    let newMessage: Message | null = null;

    if (typeof payload === 'string' && payload.trim()) {
      newMessage = {
        id: Date.now(),
        chatId: chat.id,
        senderId: CURRENT_USER_ID,
        text: payload,
        time,
      };
    } else if (payload !== null && typeof payload === 'object' && 'image' in payload) {
      newMessage = {
        id: Date.now(),
        chatId: chat.id,
        senderId: CURRENT_USER_ID,
        text: '',
        image: (payload as { image: string }).image,
        time,
      };
    }

    if (newMessage) {
      this.props.messages = [...messages, newMessage];
    }
  };

  remove() {
    super.remove();
    eventBus.off('message:send', this.onMessageSend);
  }
}
