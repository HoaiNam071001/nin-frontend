//#region --- Types & Enums ---

import I18n from "@/components/_commons/I18n";
import Loader from "@/components/_commons/Loader";
import NAvatar from "@/components/_commons/NAvatar";
import { DATE_FORMATS } from "@/constants";
import { formatDate } from "@/helpers/date";
import useAuth from "@/hooks/useAuth";
import { User } from "@/models";
import { ChatbotRole, ChatMessage } from "@/models/chatbot";
import moment from "moment";
import { FC } from "react";
import "./chatbot.scss";
//#endregion
const formatMessengerTime = (dateString: string) => {
  const mDate = moment(dateString);
  const now = moment();

  if (now.diff(mDate, "days") === 0) {
    return `Today at ${mDate.format("h:mm A")}`;
  } else if (now.diff(mDate, "days") === 1) {
    return `Yesterday at ${mDate.format("h:mm A")}`;
  } else if (now.diff(mDate, "days") < 7) {
    return `${mDate.format("dddd")} at ${mDate.format("h:mm A")}`;
  } else {
    return mDate.format("MMM D, YYYY [at] h:mm A");
  }
};
//#region --- ChatMessageItem Component ---
interface ChatMessageItemProps {
  message: ChatMessage;
  currentUser: User;
}
const transformMessageContent = (html: string) => {
  // Thay tất cả link và loại ký tự không hợp lệ ở cuối
  const withLinks = html.replace(/(https?:\/\/[^\s<]+)/g, (match) => {
    // Loại các ký tự không hợp lệ ở cuối URL (., ,, ), ], ?, !)
    const cleaned = match.replace(/[.,)\]\?!]+$/, "");
    const suffix = match.slice(cleaned.length); // Ký tự bị cắt (nếu có)
    return `<a href="${cleaned}" target="_blank" rel="noopener noreferrer">Link</a>${suffix}`;
  });

  // Thay ' - ' bằng <br/>
  const withDashBreaks = withLinks.replace(/ - /g, "<br/>");

  // Thay dấu '.' (kết thúc câu) bằng '.' + <br/>
  const withDotBreaks = withDashBreaks.replace(/\.(\s|$)/g, ".<br/>");

  return withDotBreaks;
};

const ChatMessageItem: FC<ChatMessageItemProps> = ({
  message,
  currentUser,
}) => {
  const isBot = message.sender === ChatbotRole.BOT;
  return (
    <div>
      <div
        className={`flex gap-2 ${
          isBot ? "justify-start mr-20" : "justify-end ml-20"
        }`}
      >
        {isBot && (
          <NAvatar
            tooltip={formatDate({
              date: message.createdAt,
              format: DATE_FORMATS.AM_PM_FORMAT,
            })}
            name={"BOT"}
            src="/images/chatbot.png"
          />
        )}
        <div className="p-2 bg-system bg-opacity-5 border border-stroke rounded-lg message-container overflow-hidden">
          {message.content && (
            // <ReactMarkdown>{message.content}</ReactMarkdown>
            <span
              dangerouslySetInnerHTML={{
                __html: transformMessageContent(message.content),
              }}
            ></span>
          )}
          {!message.content && (
            <span className="flex items-center gap-2">
              <Loader size="xs" />
              <I18n i18key="Processing" />{" "}
            </span>
          )}
        </div>
        {!isBot && (
          <NAvatar
            tooltip={formatDate({
              date: message.createdAt,
              format: DATE_FORMATS.AM_PM_FORMAT,
            })}
            name={`${currentUser.fullName}`}
            src={currentUser.avatar}
          />
        )}
      </div>
      {!isBot && (
        <div className={`text-[10px] text-gray-400 mt-1 text-right`}>
          {formatMessengerTime(message.createdAt)}
        </div>
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
        <ChatMessageItem key={index} message={msg} currentUser={currentUser} />
      ))}
    </div>
  );
};
//#endregion

export default ChatMessageList;
