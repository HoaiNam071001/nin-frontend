import { StorageKey } from "@/constants";
import apiClient from "../config";
import {
  ChatMessage,
  ChatMessagePayload,
  Conversation,
  ConversationPayload,
} from "@/models/chatbot";
import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";

export const chatbotService = {
  chat: async (
    payload: ChatMessagePayload,
    onMessage: (chunk: string) => void
  ): Promise<void> => {
    const token = localStorage.getItem(StorageKey.AUTH_TOKEN);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chatbot`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      onMessage(decoder.decode(value, { stream: true }));
    }
  },

  createConversation: async () => {
    const response = await apiClient.post<Conversation>("chatbot/conversation");
    return response.data;
  },

  getConversations: async () => {
    const response = await apiClient.get<Conversation[]>(
      "chatbot/conversation"
    );
    return response.data;
  },

  updateConversation: async (id: number, payload: ConversationPayload) => {
    const response = await apiClient.put<Conversation[]>(
      `chatbot/conversation/${id}`,
      payload
    );
    return response.data;
  },

  deleteConversation: async (id: number) => {
    const response = await apiClient.delete<Conversation[]>(
      `chatbot/conversation/${id}`
    );
    return response.data;
  },

  getMessages: async (conversationId: number, pageable: PageAble) => {
    const params = `${stringifyPageAble(pageable)}`;
    const response = await apiClient.get<List2Res<ChatMessage>>(
      `chatbot/${conversationId}/messages?${params}`
    );
    return response.data;
  },
};
