import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat, getChatsByUserId } from '../../props/Chat';
import { Message, messagesByChatId } from '../../props/Message';
import { ChatSidebar } from '../../components/ChatSidebar/ChatSidebar';
import { ChatWindow } from '../../components/ChatWindow/ChatWindow';
import template from './ChatPage.hbs?raw';

export class ChatPage extends Block {
  declare protected props: {
    userChats: Chat[];
    selectedChat: Chat | null;
    messages: Message[];
  };

  constructor(userId: number) {
    super({
      userChats: getChatsByUserId(userId),
      selectedChat: null,
      messages: [],
    });
  }

  protected render() {
    return template;
  }

  protected children(): Record<string, Block> {
    const { userChats, selectedChat, messages } = this.props;

    return {
      chatSidebar: new ChatSidebar({ chats: userChats }),
      chatWindow: new ChatWindow({
        chat: selectedChat,
        messages,
      }),
    };
  }

  protected onMount() {
    eventBus.on('chat:select', this.onChatSelect);
  }

  private onChatSelect = (chatId: unknown) => {
    if (typeof chatId !== 'number') {
      return;
    }

    const userChats = this.props.userChats;
    const selected = userChats.find((_chat) => _chat.id === chatId);

    if (!selected) {
      return;
    }

    this.props.selectedChat = selected;
    this.props.messages = messagesByChatId[chatId] || [];
  };

  remove() {
    super.remove();
    eventBus.off('chat:select', this.onChatSelect);
  }
}
