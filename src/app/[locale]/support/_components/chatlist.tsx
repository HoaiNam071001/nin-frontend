"use client";

import { Conversation } from "@/models/chatbot";
import { chatbotService } from "@/services/ai/chatbot.service";
import { toastService } from "@/services/toast.service";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ChatbotContext } from "../page";
import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import I18n from "@/components/_commons/I18n";
import NInput from "@/components/_commons/NInput";
import { formatDate } from "@/helpers/date";

const ChatList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { conversation, setConversation, add } = useContext(ChatbotContext);

  const fetchConversations = async () => {
    try {
      const items: Conversation[] = await chatbotService.getConversations();
      setConversations(items);
      setConversation(items[0] ?? null);
      if (!items?.length) {
        addNew();
      }
    } catch (error) {
      toastService.info(error?.message);
      setConversations([]);
    }
  };

  const groupedConversations = useMemo(() => {
    const grouped: { [date: string]: Conversation[] } = {};
    conversations.forEach((conv) => {
      const date = new Date(conv.updatedAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(conv);
    });
    return grouped;
  }, [conversations]);

  const addNew = useCallback(async () => {
    try {
      const newConversation: Conversation =
        await chatbotService.createConversation();
      setConversations((prev) => [newConversation, ...prev]);
      setConversation(newConversation);
    } catch (error) {
      toastService.error(error?.message);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (add) {
      addNew();
    }
  }, [add]);

  const formattedDates = useMemo(() => {
    const today = new Date().toLocaleDateString();
    const formatted: { [date: string]: string } = {};
    Object.keys(groupedConversations).forEach((date) => {
      const formattedDate = new Date(date).toLocaleDateString();
      formatted[date] = formattedDate === today ? 'Today' : formatDate({date});
    });
    return formatted;
  }, [groupedConversations]);


  return (
    <div className="h-full min-w-[100px] overflow-hidden flex flex-col">
      <div className="font-semibold my-3 mx-2">Support</div>
      <NButton
          variant="filled"
          color="primary"
          className="mb-3 sticky top-0"
          onClick={addNew}
        >
          <I18n i18key={"New"} />
        </NButton>
      <div className="flex flex-col overflow-auto flex-1">
        {Object.keys(groupedConversations).map((date) => (
          <div key={date}>
            <div className="font-semibold p-2 text-sm text-secondary rounded-md">
              {formattedDates[date]}
            </div>
            {groupedConversations[date].map((row) => (
              <div className="mb-2" key={row.id}>
                <ChatItem
                  row={row}
                  setRows={setConversations}
                  conversation={conversation}
                  setConversation={setConversation}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;

const ChatItem = ({ row, setRows, conversation, setConversation }) => {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(row.name);
  const remove = async () => {
    try {
      await chatbotService.deleteConversation(row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      if (conversation?.id === row.id) {
        setConversation(null);
      }
    } catch (error) {
      toastService.error(error?.message);
    }
  };

  const editItem = async () => {
    try {
      const item = await chatbotService.updateConversation(row.id, {
        name: draftName,
      });
      Object.assign(row, item);
      setRows((prev) => [...prev]);
      setEditing(false);
    } catch (error) {
      toastService.error(error?.message);
    }
  };

  const select = (item: Conversation) => {
    if (item.id === conversation?.id) {
      return;
    }
    setConversation(item);
  };

  return (
    <div
      className={`cursor-pointer hover:bg-system hover:bg-opacity-10 rounded-md text-ellipsis flex items-center group relative border border-stroke ${
        row.id === conversation?.id ? "bg-system bg-opacity-10" : ""
      }`}
      key={row.id}
    >
      {editing && (
        <>
          <NInput
            value={draftName}
            onValueChange={(value) => setDraftName(value)}
            className="w-full"
            onSearch={() => editItem()}
          />
          <div className="flex flex-col ml-auto px-1">
            <NButton
              variant="link"
              color="black"
              tooltip={"Cancel"}
              className="!px-0 hover:text-gray"
              tooltipPlacement="top"
              onClick={(event) => {
                event.preventDefault();
                setDraftName(row.name);
                setEditing(false);
              }}
            >
              <SvgIcon icon="close" className="icon icon-sm" />
            </NButton>
            <NButton
              variant="link"
              color="black"
              tooltip={"Save"}
              className="!px-0 hover:text-system"
              tooltipPlacement="bottom"
              onClick={(event) => {
                event.preventDefault();
                editItem();
              }}
            >
              <SvgIcon icon="edit" className="icon icon-sm" />
            </NButton>
          </div>
        </>
      )}
      {!editing && (
        <>
          <div
            className="cursor-pointer flex-1 px-2 py-3 capitalize text-ellipsis"
            onClick={() => select(row)}
            title={row.name}
          >
            {row.name}
          </div>

          <div className="hidden group-hover:block absolute right-0 top-0 px-1 z-10">
            <div className="flex flex-col">
              <NButton
                variant="link"
                color="black"
                className="!px-0 hover:text-system"
                tooltip={"Edit"}
                tooltipPlacement="top"
                onClick={(event) => {
                  event.preventDefault();
                  setEditing(true);
                }}
              >
                <SvgIcon icon="edit" className="icon icon-sm" />
              </NButton>
              <NButton
                variant="link"
                color="black"
                className="!px-0 hover:text-red"
                tooltip={"Remove"}
                tooltipPlacement="bottom"
                onClick={(event) => {
                  event.preventDefault();
                  remove();
                }}
              >
                <SvgIcon icon="close" className="icon icon-sm" />
              </NButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
