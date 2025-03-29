"use client";

import { ReactNode, useState } from "react";
import ClickOutside from "./ClickOutside";

interface DropdownProps {
  trigger: ReactNode; // Nội dung của button trigger
  children: ReactNode | ((closeDropdown: () => void) => ReactNode); // Children có thể là ReactNode hoặc hàm
  buttonClassName?: string;
  dropdownClassName?: string;
  dWidth?: number;
  dHeight?: number;
  position?: "left" | "right" | "center"; // Vị trí dropdown
  onOpen?: () => void; // Sự kiện khi dropdown mở
  onHide?: () => void; // Sự kiện khi dropdown đóng
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

  const positionClasses = {
    left: "origin-top-left left-0",
    right: "origin-top-right right-0",
    center: "origin-top left-1/2 -translate-x-1/2",
  };

  const handleToggle = () => {
    if (isOpen) {
      onHide?.();
    } else {
      onOpen?.();
    }
    setIsOpen(!isOpen);
  };

  const handleClickOutside = () => {
    if (isOpen) {
      onHide?.();
      setIsOpen(false);
    }
  };

  const closeDropdown = () => {
    if (isOpen) {
      onHide?.();
      setIsOpen(false);
    }
  };

  // Kiểm tra xem children có phải là hàm không
  const renderedChildren =
    typeof children === "function" ? children(closeDropdown) : children;

  return (
    <ClickOutside onClick={handleClickOutside}>
      <div className="relative inline-block text-left">
        {/* Button Trigger */}
        <div
          className={`cursor-pointer ${buttonClassName}`}
          onClick={handleToggle}
        >
          {trigger}
        </div>

        {isOpen && (
          <div
            style={{
              width: dWidth ?? "auto",
              height: dHeight ?? "auto",
            }}
            className={`absolute border-[0.5px] border-stroke mt-2 rounded-md shadow-lg bg-white ${positionClasses[position]} ${dropdownClassName}`}
          >
            {renderedChildren}
          </div>
        )}
      </div>
    </ClickOutside>
  );
};

export default CustomDropdown;
