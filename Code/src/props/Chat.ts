import chatsJson from '../data/chats.json';

export interface Chat {
  id: number;
  userId: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageSender: 'me' | 'them';
  time: string;
  unreadCount: number;
}

export const chats: Chat[] = chatsJson as Chat[];

export function getChatsByUserId(userId: number): Chat[] {
  return chats.filter((chat) => chat.userId === userId);
}
