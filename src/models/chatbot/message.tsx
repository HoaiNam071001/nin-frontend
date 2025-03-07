export enum ChatbotRole {
  USER = "User",
  BOT = "NIN Assistant",
}

export interface ChatMessage {
  sender: ChatbotRole;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessagePayload {
  content: string;
  conversationId?: number;
}

export class Conversation {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ConversationPayload {
  name: string;
}