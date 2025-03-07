//#region --- Types & Enums ---

import NAvatar from "@/components/_commons/NAvatar";
import { ChatbotRole, ChatMessage } from "@/models/chatbot";
import { FC } from "react";
import "./chatbot.scss";
import { formatDate } from "@/helpers/date";
import { DATE_FORMATS } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { User } from "@/models";
import Loader from "@/components/_commons/Loader";
import I18n from "@/components/_commons/I18n";

//#endregion

//#region --- ChatMessageItem Component ---
interface ChatMessageItemProps {
  message: ChatMessage;
  currentUser: User;
}

const ChatMessageItem: FC<ChatMessageItemProps> = ({ message, currentUser }) => {
  const isBot = message.sender === ChatbotRole.BOT;
  return (
    <div
      className={`flex gap-2 ${
        isBot ? "justify-start mr-20" : "justify-end ml-20"
      }`}
    >
      {isBot && (
        <NAvatar
          tooltip={formatDate(message.createdAt, DATE_FORMATS.AM_PM_FORMAT)}
          name={'BOT'}
          src="/images/chatbot.png"
        />
      )}
      <div className="p-2 bg-system bg-opacity-5 border border-stroke rounded-lg message-container">
        {message.content && <span dangerouslySetInnerHTML={{ __html: message.content }}></span>}
        {!message.content && <span className="flex items-center gap-2"><Loader size="xs"/><I18n i18key="Processing"/> </span>}
      </div>
      {!isBot && (
        <NAvatar
          tooltip={formatDate(message.createdAt, DATE_FORMATS.AM_PM_FORMAT)}
          name={`${currentUser.fullName}`}
          src={currentUser.avatar}
        />
      )}
    </div>
  );
};
//#endregion

//#region --- ChatMessageList Component ---
interface ChatMessageListProps {
  messages: ChatMessage[];
}

const ChatMessageList: FC<ChatMessageListProps> = ({ messages }) => {
  const { currentUser } = useAuth();
  return (
    <div className="flex flex-col gap-4 mt-auto">
      {messages.map((msg, index) => (
        <ChatMessageItem key={index} message={msg} currentUser={currentUser}/>
      ))}
    </div>
  );
};
//#endregion

export default ChatMessageList;
