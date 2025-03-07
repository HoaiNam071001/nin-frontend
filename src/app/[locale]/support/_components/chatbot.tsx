"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  FC,
  useContext,
} from "react";
import SvgIcon from "@/components/_commons/SvgIcon";
import ChatInput from "./chatInput";
import { ChatbotRole, ChatMessage, Conversation } from "@/models/chatbot";
import ChatMessageList from "./chatMessage";
import { chatbotService } from "@/services/ai/chatbot.service";
import { ChatbotContext } from "../page";
import { List2Res, PageAble, PageInfo } from "@/models/utils.model";
import { DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import { toastService } from "@/services/toast.service";
import { v4 } from "uuid";
import CustomImage from "@/components/_commons/CustomImage";
import NAvatar from "@/components/_commons/NAvatar";

const Chatbot = () => {
  const { conversation, setAdd } = useContext(ChatbotContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
  });
  const [pageInfo, setPageInfo] = useState<PageInfo>();

  const addCon = () => {
    setAdd(v4());
  };

  const fetchMessages = async () => {
    try {
      if (!conversation) {
        setMessages([]);
        return;
      }

      if (pageAble.page === FIRST_PAGE) {
        setMessages([]);
      }
      const { content, ...res }: List2Res<ChatMessage> =
        await chatbotService.getMessages(conversation?.id, pageAble);
      if (res.page === FIRST_PAGE) {
        if (content.length) {
          setMessages(content);
        }
        setTimeout(() => {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
          });
        }, 200);
      } else {
        setMessages([...content, ...messages]);
      }
      setPageInfo(res);
    } catch (error) {
      toastService.info(error?.message);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [pageAble]);

  useEffect(() => {
    setPageAble({
      page: FIRST_PAGE,
      size: DEFAULT_PAGESIZE,
    });
  }, [conversation]);

  const getOldMessage = () => {
    setPageAble({
      page: pageInfo.page + 1,
      size: DEFAULT_PAGESIZE,
    });
  };

  return (
    <div className="h-full flex flex-col border border-stroke rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-slate-50 border-b border-stroke capitalize flex items-center gap-4">
      <NAvatar
          name={'BOT'}
          src="/images/chatbot.png"
        />
        <div className="font-semibold">{conversation?.name}</div>
      </div>
      <div
        className="flex-1 overflow-auto flex flex-col gap-4 px-4 pt-4 bg-white shadow-lg"
        ref={containerRef}
      >
        <ChatbotContent
          messages={messages}
          setMessages={setMessages}
          conversation={conversation}
          addConversation={addCon}
          containerRef={containerRef}
        ></ChatbotContent>
      </div>
    </div>
  );
};

export default Chatbot;

export const ChatbotContent = ({
  messages,
  setMessages,
  conversation,
  addConversation,
  containerRef,
}: {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  conversation: Conversation;
  addConversation: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [loading, setLoading] = useState(false);
  const [draftQuestion, setDraftQuestion] = useState(null);

  
  useEffect(() => {
    checkIfAtBottom();
  }, [messages]);

  useEffect(() => {
    if (conversation && draftQuestion) {
      setDraftQuestion(null);
      onSearch(draftQuestion);
    }
  }, [draftQuestion, conversation]);

  // Scroll container xuống dưới
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        behavior: "smooth",
        top: containerRef.current.scrollHeight,
      });
    }
  }, []);

  // Kiểm tra xem container có đang ở cuối không
  const checkIfAtBottom = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      setIsAtBottom(scrollTop + clientHeight + 50 >= scrollHeight);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkIfAtBottom);
    return () => container.removeEventListener("scroll", checkIfAtBottom);
  }, [checkIfAtBottom]);

  const onSearch = async (keyword: string) => {
    if (!keyword.trim()) return;

    const userChat: ChatMessage = {
      sender: ChatbotRole.USER,
      content: keyword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const botChat: ChatMessage = {
      sender: ChatbotRole.BOT,
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    let newMessage = [...messages, userChat, botChat];
    setMessages(newMessage);
    setLoading(true);
    if (isAtBottom) {
      setTimeout(() => {
        scrollToBottom();
      }, 500);
    }

    try {
      await chatbotService.chat(
        { content: keyword, conversationId: conversation?.id }, // Gửi payload
        (chunk) => {
          const updated = [...newMessage];
          if (updated[updated.length - 1]) {
            updated[updated.length - 1].content += chunk;
          }
          setMessages(updated);
        }
      );
    } catch (error) {
      console.error("Error fetching chat response:", error);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = (keyword: string) => {
    setDraftQuestion(keyword);
    if (!conversation) {
      addConversation();
    }
  };

  return (
    <>
      {messages?.length > 0 && <ChatMessageList messages={messages} />}
      <div
        className={` bg-white  ${
          messages?.length ? "sticky bottom-0 pb-6 pt-2" : "my-auto"
        }`}
      >
        {!messages?.length && (
          <>
            <div className="flex items-center flex-col gap-2 mb-5 text-[20px]">
              <CustomImage width={150} src={"/images/chatbot.png"} alt={""} />
              <span>Welcome to the AI Chatbot</span>
            </div>
          </>
        )}
        {!isAtBottom && (
          <div className="relative">
            <div
              onClick={scrollToBottom}
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 cursor-pointer p-1 bg-slate-400 flex items-center justify-center my-auto rounded-full"
            >
              <SvgIcon
                icon="arrow"
                className="icon icon-md rotate-180 text-white"
              />
            </div>
          </div>
        )}
        <ChatInput search={addQuestion} loading={loading} />
      </div>
    </>
  );
};
