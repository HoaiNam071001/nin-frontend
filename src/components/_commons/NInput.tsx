import React, { FocusEventHandler, useState } from "react";
import { Input } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

interface NInputProps {
  id?: string;
  type?: "text" | "password" | "email" | "number" | "tel"; // Common input types
  value?: string | number; // Input value
  onValueChange: (value: string | number) => void; // Handler for value changes
  input?: React.FormEventHandler<HTMLInputElement>; // Handler for onInput event
  keyUp?: React.KeyboardEventHandler<HTMLInputElement>; // Handler for onKeyUp event
  keyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void; // Handler for onKeyDown event
  onBlur?: FocusEventHandler<HTMLInputElement>; // Handler for
  placeholder?: string; // Placeholder text
  className?: string; // Optional CSS class for styling
  addonBefore?: React.ReactNode; // Addon content before the input
  addonAfter?: React.ReactNode; // Addon content after the input
  size?: "small" | "middle" | "large"; // Size of the input field
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
  placeholder = "",
  className = "",
  addonBefore,
  addonAfter,
  size = "large", // Default size is middle
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.repeat) return; // Prevent repeated key events

    if (keyDown) {
      keyDown(event); // Trigger the custom keyDown handler
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState); // Toggle password visibility
  };

  const inputType = type === "password" && showPassword ? "text" : type;

  const passwordAddonAfter =
    type === "password" ? (
      <span onClick={handleTogglePasswordVisibility} className="cursor-pointer">
        {showPassword ? (
          <EyeOutlined style={{ fontSize: 16 }} />
        ) : (
          <EyeInvisibleOutlined style={{ fontSize: 16 }} />
        )}
      </span>
    ) : null;

  return (
    <div className="relative">
      {addonBefore && (
        <div className="absolute left-1 z-10 h-full flex items-center">
          {addonBefore}
        </div>
      )}
      {(addonAfter || passwordAddonAfter) && (
        <div className="absolute right-3 z-10 h-full flex items-center">
          {addonAfter || passwordAddonAfter}
        </div>
      )}
      <Input
        id={id}
        type={inputType}
        value={value}
        size={size}
        onChange={(e) => onValueChange(e.target.value)}
        onInput={input}
        onKeyUp={keyUp}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`border-stroke ${className} ${
          addonBefore ? "pl-[40px]" : ""
        } ${addonAfter || passwordAddonAfter ? "pr-[50px]" : ""}`}
        addonBefore={addonBefore}
      />
    </div>
  );
};

export default NInput;
