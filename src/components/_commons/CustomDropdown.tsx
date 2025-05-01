"use client";

import { ReactNode, useRef, useState } from "react";
import ClickOutside from "./ClickOutside";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode | ((closeDropdown: () => void) => ReactNode);
  buttonClassName?: string;
  dropdownClassName?: string;
  dWidth?: number;
  dHeight?: number;
  position?: "left" | "right" | "center";
  onOpen?: () => void;
  onHide?: () => void;
}

const CustomDropdown = ({
  trigger,
  children,
  buttonClassName = "",
  dropdownClassName = "",
  position = "right",
  dWidth,
  dHeight,
  onOpen,
  onHide,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // Thêm state để theo dõi trạng thái đóng
  const dropdownRef = useRef<HTMLDivElement>(null); // Thêm ref để truy cập phần tử dropdown

  const positionClasses = {
    left: "origin-top-left left-0",
    right: "origin-top-right right-0",
    center: "origin-top left-1/2 -translate-x-1/2",
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsClosing(true); // Bắt đầu animation đóng
      setTimeout(() => {
        onHide?.();
        setIsOpen(false);
        setIsClosing(false); // Reset trạng thái đóng
      }, 300); // Đảm bảo animation hoàn thành trước khi ẩn dropdown
    } else {
      onOpen?.();
      setIsOpen(true);
    }
  };

  const handleClickOutside = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        onHide?.();
        setIsOpen(false);
        setIsClosing(false);
      }, 300);
    }
  };

  const closeDropdown = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        onHide?.();
        setIsOpen(false);
        setIsClosing(false);
      }, 300);
    }
  };

  const renderedChildren =
    typeof children === "function" ? children(closeDropdown) : children;

  return (
    <ClickOutside onClick={handleClickOutside}>
      <div className="relative inline-block text-left">
        <div
          className={`cursor-pointer ${buttonClassName}`}
          onClick={handleToggle}
        >
          {trigger}
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            style={{
              width: dWidth ?? "auto",
              height: dHeight ?? "auto",
            }}
            className={`absolute border-[0.5px] border-stroke mt-3 rounded-md shadow-lg overflow-hidden bg-white z-[9999] ${
              positionClasses[position]
            } ${dropdownClassName} ${
              isClosing ? "animate-slideUp" : "animate-slideDown"
            }`}
          >
            {renderedChildren}
          </div>
        )}
      </div>
    </ClickOutside>
  );
};

export default CustomDropdown;
