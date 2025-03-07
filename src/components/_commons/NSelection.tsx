"use client";

import React, { useRef, useState } from "react";
import ClickOutside from "../_commons/ClickOutside";
import FormInput from "../_commons/NInput";
import useDebounce from "@/hooks/useDebounce";
import SvgIcon from "./SvgIcon";
import useEffectSkipFirst from "@/hooks/useEffectSkipFirst";

type DropdownProps<T> = {
  value: T;
  options: T[];
  bindLabel?: keyof T;
  bindValue?: keyof T;
  className?: string;
  multiple?: boolean;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  searchOnFirstOpen?: boolean;
  dropdownWidth?: string;
  onChange: (value: T) => void;
  onSearch?: (key?: string) => void;
  renderLabel?: (option: T) => React.ReactNode;
  renderOption?: (option: T) => React.ReactNode;
};

const NSelection = <T extends object>({
  value,
  options = [],
  bindLabel = "name" as keyof T,
  bindValue,
  placeholder,
  className,
  multiple = false,
  searchable = false,
  clearable = false,
  searchOnFirstOpen = false,
  dropdownWidth = "100%",
  onChange,
  onSearch,
  renderLabel,
  renderOption,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState<string>();
  const searchTextDebounce = useDebounce<string>(searchText, 500);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const isFirstOpen = useRef(true);

  useEffectSkipFirst(() => {
    onSearch?.(searchTextDebounce);
  }, [searchTextDebounce]);

  const toggleDropdown = () => setOpen(!isOpen);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleSelectOption = (option: T) => {
    if (multiple) {
      const currentValue = (value as T[]) || [];
      const isSelected = bindValue
        ? currentValue.some((val) => val === option[bindValue])
        : currentValue.includes(option);

      const newValue = isSelected
        ? currentValue.filter((val) =>
            bindValue ? val !== option[bindValue] : val !== option
          )
        : [...currentValue, bindValue ? option[bindValue] : option];

      onChange(newValue as T);
    } else {
      onChange((bindValue ? option[bindValue] : option) as T);
      setOpen(false);
    }
  };

  const setOpen = (open: boolean)=> {
    if (isOpen === open) {
      return;
    }
    // reset
    if (!open && searchText?.length) {
      setSearchText("");
    }
    if (open && isFirstOpen) {
      isFirstOpen.current = false;
      if (searchOnFirstOpen) {
        setSearchText("");
      }
    }
    setIsOpen(open);
  }

  const renderSelectedLabel = (fieldValue) => {
    if (multiple) {
      const selectedOptions = bindValue
        ? options.filter((option) => fieldValue?.includes(option[bindValue]))
        : fieldValue;
      return (
        <div className="flex items-center flex-wrap gap-2">
          {selectedOptions.map((option, index) => (
            <div key={index} className="relative group">
              {renderLabel ? renderLabel(option) : option[bindLabel]}
              {clearable && (
                <div
                  className="ml-auto hover:text-red absolute right-1 top-0 invisible group-hover:visible translate-y-[50%]"
                  onClick={(event) => {
                    event?.stopPropagation();
                    event?.preventDefault();
                    handleSelectOption(option);
                  }}
                >
                  <SvgIcon className="icon icon-sm" icon="close"></SvgIcon>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    const selectedOption = bindValue
      ? options.find((option) => option[bindValue] === fieldValue)
      : fieldValue;

    return renderLabel
      ? renderLabel(selectedOption)
      : selectedOption?.[bindLabel];
  };

  const optionLabel = (option: T) => {
    return renderOption
      ? renderOption(option)
      : (option?.[bindLabel] as string);
  };

  const clearAll = (event) => {
    event?.stopPropagation();
    event?.preventDefault();
    onChange((multiple ? [] : null) as T);
    setOpen(false);
  };

  return (
    <ClickOutside
      onClick={() => setOpen(false)}
      className={`relative inline-block text-left min-w-[100px] ${className}`}
    >
      <div
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`cursor-pointer w-full min-w-[100px] px-2 py-1 hover:bg-slate-50 focus:bg-slate-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-between border border-[var(--n-border)] rounded-sm`}
      >
        {(multiple && (value as T[])?.length) || (!multiple && value) ? (
          <span>{renderSelectedLabel(value)}</span>
        ) : (
          <span className="text-[var(--n-secondary)]">
            {placeholder || "Select an option"}
          </span>
        )}
        {clearable && (
          <div className="ml-auto hover:text-red" onClick={clearAll}>
            <SvgIcon className="icon icon-sm" icon="close"></SvgIcon>
          </div>
        )}
        <SvgIcon
          className="icon icon-sm ml-1 rotate-180"
          icon="arrow"
        ></SvgIcon>
      </div>

      {/* Dropdown container with animation for opening */}
      <div
        style={{
          width: dropdownWidth,
        }}
        className={`absolute z-10 max-h-60 overflow-auto bg-white border rounded-sm shadow-lg transition-all duration-300 ease-in-out ${
          isOpen
            ? ` opacity-100 transform ${
                window.innerHeight -
                  (buttonRef?.current?.getBoundingClientRect()?.bottom || 0) <
                300
                  ? "bottom-full mb-2"
                  : "top-full mt-2"
              }`
            : `opacity-0 pointer-events-none h-0`
        }`}
      >
        {searchable && (
          <div className="p-2 border-b sticky top-0 bg-white">
            <FormInput
              value={searchText}
              onValueChange={(value) => setSearchText(value as string)}
              placeholder="Search"
              size="middle"
              keyDown={handleKeyDown}
            />
          </div>
        )}
        <ul className="text-sm text-gray-700">
          {options.map((option, index) => {
            const isSelected = multiple
              ? (value as T[]).some((val) => val === option[bindValue])
              : (value as T) === option[bindValue];

            return (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`block w-full px-4 py-2 text-left hover:bg-[var(--n-row-hover)] ${
                    isSelected ? "bg-slate-100" : ""
                  }`}
                >
                  {optionLabel(option)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </ClickOutside>
  );
};

export default NSelection;
