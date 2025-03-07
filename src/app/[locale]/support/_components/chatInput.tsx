import I18n from "@/components/_commons/I18n";
import SvgIcon from "@/components/_commons/SvgIcon";
import { useTranslate } from "@/hooks/useTranslate";
import { FC, useCallback, useEffect, useRef, useState } from "react";

//#region --- ChatInput Component ---
interface ChatInputProps {
  search: (keyword: string) => void;
  loading: boolean;
}

const ChatInput: FC<ChatInputProps> = ({ search, loading }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const translate = useTranslate();

  const handleSearch = useCallback(() => {
    if (loading) return;
    const trimmedInput = input.trim();
    textareaRef.current.innerHTML = "";
    setInput("");
    if (trimmedInput) {
      search(trimmedInput);
    }
  }, [input, loading, search]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.repeat) return; // Prevent repeated key events
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset chiều cao để tính toán scrollHeight chính xác
      textarea.style.height = "auto";
      const newHeight = textarea.scrollHeight;
      if (newHeight <= 200) {
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = "hidden";
      } else {
        textarea.style.height = "200px";
        textarea.style.overflowY = "auto";
      }
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [input, adjustHeight]);

  return (
    <div className="bg-white rounded-[30px] flex px-4 py-1 shadow-lg border-stroke border-[0.8px] mx-10">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={translate("Enter your question") + '...'}
        className="flex-1 resize-none px-4 py-3 focus:outline-0"
        rows={1}
        style={{ overflow: "hidden" }}
      />
      <div
        onClick={handleSearch}
        className="cursor-pointer p-2 hover:opacity-100 text-[var(--n-secondary)] opacity-50 flex items-center justify-center my-auto rounded-full"
      >
        <SvgIcon icon="search" className="icon icon-md" />
      </div>
    </div>
  );
};
//#endregion

export default ChatInput;
