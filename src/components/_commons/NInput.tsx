import React, { FocusEventHandler, useState } from "react";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useTranslate } from "@/hooks/useTranslate";

export interface NInputProps {
  id?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'date' | 'time';
  value?: string | number;
  onValueChange?: (value: string | number) => void;
  input?: React.FormEventHandler<HTMLInputElement>;
  keyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  keyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onSearch?: (value: string) => void;
  placeholder?: string;
  className?: string;
  addonBefore?: React.ReactNode;
  addonAfter?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "xxl"; // Kích thước input
  shape?: "none" | "sm" | "md" | "lg" | "xl" | "xxl" | "full"; // Hình dạng input
  align?: "left" | "center" | "right"; // Add align prop
  min?: number;
  max?: number;
}

const NInput: React.FC<NInputProps> = ({
  id,
  type = "text",
  value = "",
  onValueChange,
  input,
  keyUp,
  keyDown,
  onBlur,
  onFocus,
  onSearch,
  placeholder = "",
  className = "",
  addonBefore,
  addonAfter,
  size = "md", // Kích thước mặc định là md
  shape = "md", // Hình dạng mặc định là md
  align = "left",
  ...rest
}) => {
  const translate = useTranslate();

  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.repeat) return;
    if (event.key === "Enter") {
      onSearch?.(value as string);
    }
    if (keyDown) {
      keyDown(event);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  const passwordAddonAfter =
    type === "password" ? (
      <span
        onClick={handleTogglePasswordVisibility}
        className="cursor-pointer pr-3"
      >
        {showPassword ? (
          <EyeOutlined style={{ fontSize: 16 }} />
        ) : (
          <EyeInvisibleOutlined style={{ fontSize: 16 }} />
        )}
      </span>
    ) : null;

    // Định nghĩa styles cho kích thước input
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "px-3 py-1",
    lg: "text-lg px-4 py-2",
    xl: "text-xl px-8 py-3",
    xxl: "text-2xl px-10 py-4",
  };

  // Định nghĩa styles cho hình dạng input
  const shapeClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    xxl: "rounded-full",
    full: "rounded-full",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className="relative">
      {addonBefore && (
        <div className="absolute left-1 z-10 h-full flex items-center">
          {addonBefore}
        </div>
      )}
      {(addonAfter || passwordAddonAfter) && (
        <div className="absolute right-0 z-10 h-full flex items-center">
          {addonAfter || passwordAddonAfter}
        </div>
      )}
      <Input
        id={id}
        type={inputType}
        value={value}
        size="large" // giữ nguyên size của antd
        onChange={(e) => onValueChange(e.target.value)}
        onInput={input}
        onKeyUp={keyUp}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={translate(placeholder)}
        className={`border-stroke ${className} ${alignClasses[align]} ${sizeClasses[size]} ${shapeClasses[shape]} ${
          addonBefore ? "pl-[40px]" : ""
        } ${addonAfter || passwordAddonAfter ? "pr-[50px]" : ""}`}
        addonBefore={addonBefore}
        {...rest}
      />
    </div>
  );
};

export default NInput;