import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { Chat, getChatsByUserId, removeChatById } from '../../props/Chat';
import { Message, messagesByChatId } from '../../props/Message';
import { ChatSidebar } from '../../components/ChatSidebar/ChatSidebar';
import { ChatWindow } from '../../components/ChatWindow/ChatWindow';
import template from './ChatPage.hbs?raw';

export class ChatPage extends Block {
  declare protected props: {
    userChats: Chat[];
    selectedChat: Chat | null;
    messages: Message[];
    mobileView: 'sidebar' | 'chat';
  };

  constructor(userId: number) {
    super({
      userChats: getChatsByUserId(userId),
      selectedChat: null,
      messages: [],
      mobileView: 'sidebar',
    });
  }

  protected render() {
    return template;
  }

  protected children(): Record<string, Block> {
    const { userChats, selectedChat, messages } = this.props;

    return {
      chatSidebar: new ChatSidebar({
        chats: userChats,
        activeChatId: selectedChat?.id ?? null,
      }),
      chatWindow: new ChatWindow({
        chat: selectedChat,
        messages,
      }),
    };
  }

  protected onMount() {
    eventBus.on('chat:select', this.onChatSelect);
    eventBus.on('mobile:back', this.onMobileBack);
    eventBus.on('chat:delete', this.onChatDelete);
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
    this.props.mobileView = 'chat';
  };

  private onMobileBack = () => {
    this.props.mobileView = 'sidebar';
  };

  private onChatDelete = () => {
    const { selectedChat, userChats } = this.props;
    if (!selectedChat) return;
    removeChatById(selectedChat.id);
    const remaining = userChats.filter((c) => c.id !== selectedChat.id);
    this.props.selectedChat = null;
    this.props.messages = [];
    this.props.mobileView = 'sidebar';
    this.props.userChats = remaining;
  };

  remove() {
    super.remove();
    eventBus.off('chat:select', this.onChatSelect);
    eventBus.off('mobile:back', this.onMobileBack);
    eventBus.off('chat:delete', this.onChatDelete);
  }
}
