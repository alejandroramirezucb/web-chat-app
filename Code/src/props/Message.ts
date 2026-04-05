import messagesJson from '../data/messages.json';

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  text: string;
  time: string;
  image?: string;
}

export const messagesByChatId: Record<number, Message[]> =
  messagesJson as Record<number, Message[]>;
