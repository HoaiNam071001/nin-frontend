"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";

interface NTextareaProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoHeight?: boolean;
  minRow?: number;
}

export const NTextarea = ({
  value,
  autoHeight = false,
  onChange,
  placeholder,
  className,
  minRow = 1,
}: NTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && autoHeight) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      rows={minRow}
      style={{
        minHeight: (minRow * 24) + 16,
      }}
      onChange={handleChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md resize-none ${className}`}
    />
  );
};