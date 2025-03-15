"use client";

import { createContext, ReactNode, useState } from "react";
import Chatbot from "./_components/chatbot";
import ChatList from "./_components/chatlist";
import { Conversation } from "@/models/chatbot";

export const ChatbotContext = createContext<{
  conversation: Conversation;
  setConversation: (c: Conversation) => void;
  setAdd: (c: string) => void;
  add: string;
} | null>(null);

const ChatbotProvider = ({ children }: { children: ReactNode }) => {
  const [conversation, setConversation] = useState(null);
  const [add, setAdd] = useState(null);

  return (
    <ChatbotContext.Provider
      value={{ conversation, setConversation, add, setAdd }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

const Support: React.FC = () => {
  return (
    <ChatbotProvider>
      <div className="container mx-auto h-[calc(100vh-130px)] bg-slate-100 flex gap-4 p-2 shadow-lg border border-stroke rounded-lg">
        <div className="h-full overflow-hidden w-[200px] max-w-[200px]">
          <ChatList></ChatList>
        </div>
        <div className="flex-1 h-full overflow-hidden relative">
          <Chatbot></Chatbot>
        </div>
      </div>
    </ChatbotProvider>
  );
};

export default Support;
