import { useTranslate } from "@/hooks/useTranslate";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React, { FocusEventHandler, useState } from "react";

export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "date"
  | "time";

export interface NInputProps {
  id?: string;
  type?: InputType;
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
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  shape?: "none" | "sm" | "md" | "lg" | "xl" | "xxl" | "full";
  align?: "left" | "center" | "right";
  min?: number;
  max?: number;
  separator?: boolean;
  disabled?: boolean;
}

const formatNumber = (value: string | number) => {
  if (typeof value === "number") value = value.toString();
  const [integer, decimal] = value.split(".");
  return decimal !== undefined
    ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + decimal
    : integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const parseNumber = (value: string) => {
  return value.replace(/,/g, "");
};

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
  size = "md",
  shape = "md",
  align = "left",
  separator = false,
  disabled = false,
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

  const inputType =
    (type === "password" && showPassword) || separator ? "text" : type;

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

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "px-3 py-1",
    lg: "text-lg px-4 py-2",
    xl: "text-xl px-8 py-3",
    xxl: "text-2xl px-10 py-4",
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (type === "number") {
      newValue = newValue.replace(/[^\d.]/g, ""); // Chỉ cho phép số và dấu chấm
      const dotCount = (newValue.match(/\./g) || []).length;
      if (dotCount > 1) return; // Chỉ cho phép một dấu chấm
      if (separator) {
        newValue = parseNumber(newValue);
      }
    }
    onValueChange?.(newValue);
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
        value={type === "number" && separator ? formatNumber(value) : value}
        size="large"
        onChange={handleChange}
        onInput={input}
        onKeyUp={keyUp}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={translate(placeholder)}
        className={`border-stroke placeholder:text-secondary ${className} ${
          alignClasses[align]
        } ${sizeClasses[size]} ${shapeClasses[shape]} ${
          addonBefore ? "pl-[40px]" : ""
        } ${addonAfter || passwordAddonAfter ? "pr-[50px]" : ""}`}
        addonBefore={addonBefore}
        disabled={disabled}
        {...rest}
      />
    </div>
  );
};

export default NInput;
