import { TooltipPlacement } from "antd/es/tooltip";
import React from "react";
import NTooltip from "./NTooltip";

interface CustomButtonProps {
  children: React.ReactNode; // Button content, like text or icons
  size?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "sm-circle"
    | "md-circle"
    | "lg-circle"
    | "xl-circle"
    | "xxl-circle"; // Button size
  variant?:
    | "solid" // Solid background color
    | "outlined" // Border and transparent background
    | "dashed" // Dashed border and transparent background
    | "filled" // Filled with color (similar to solid but with more emphasis)
    | "text" // Text-only (no background)
    | "link"; // Button color variant
  color?:
    | "primary"
    | "orange"
    | "secondary"
    | "black"
    | "white"
    | "gray"
    | "blue"
    | "red"
    | "green"
    | "yellow"
    | "purple";
  onClick?: (event) => void; // Function to call when button is clicked
  loading?: boolean; // If true, show loading spinner
  disabled?: boolean; // If true, disable the button
  shape?: "none" | "sm" | "md" | "lg" | "xl" | "xxl" | "full"; // Border radius shape for the button
  className?: string;
  tooltip?: string;
  canClick?: boolean; //
  tooltipPlacement?: TooltipPlacement;
}

const NButton: React.FC<CustomButtonProps> = ({
  children,
  size = "md",
  variant = "solid",
  color = "primary",
  onClick,
  loading = false,
  disabled = false,
  shape = "md", // Default to medium shape
  className,
  tooltip = "",
  tooltipPlacement = "top",
  canClick = true,
}) => {
  // Define styles for different button sizes
  const sizeClasses = {
    sm: "text-xs px-2 py-1", // Small size
    md: "px-3 py-1", // Medium size (default)
    lg: "text-lg px-4 py-2", // Large size
    xl: "text-xl px-8 py-3", // Extra large size
    xxl: "text-2xl px-10 py-4", // Double extra large size
    "sm-circle": "text-xs p-1", // Small size
    "md-circle": "p-2", // Medium size (default)
    "lg-circle": "text-lg p-2", // Large size
    "xl-circle": "text-xl p-4", // Extra large size
    "xxl-circle": "text-2xl p-5", // Double extra large size
  };

  const colorMapper = {
    primary: "system",
    orange: "orange",
    secondary: "secondary",
    black: "black",
    blue: "blue",
    red: "red",
    green: "green",
    yellow: "yellow",
    purple: "purple",
    gray: "gray",
  };

  // Define styles for different button variants
  const variantClasses = {
    solid: (color: string) =>
      `bg-${color} text-white hover:bg-opacity-90 active:scale-95 active:bg-${color}`,
    outlined: (color: string) =>
      `bg-white border border-${color} text-${color} hover:opacity-80 active:bg-${color}-100`,
    dashed: (color: string) =>
      `border-dashed border border-${color} text-${color} hover:opacity-80 active:bg-${color}-100`,
    filled: (color: string) =>
      `bg-${color} text-${color} bg-opacity-20 hover:bg-opacity-40 active:bg-${color}-800`,
    text: (color: string) =>
      `bg-${color} text-${color} bg-opacity-0 hover:bg-opacity-20 active:bg-${color}-100`,
    link: (color: string) =>
      `bg-transparent text-${color} hover:opacity-80 active:bg-${color}-100`,
  };

  // Define styles for different border radius shapes
  const shapeClasses = {
    none: "rounded-none",
    sm: "rounded-sm", // Small border radius
    md: "rounded-md", // Medium border radius (default)
    lg: "rounded-lg", // Large border radius
    xl: "rounded-xl", // Extra large border radius
    xxl: "rounded-full", // Double extra large border radius
    full: "rounded-full",
  };

  // Ánh xạ màu từ colorMapper
  const mappedColor = colorMapper[color] || colorMapper.primary;

  // Tạo các class cho button
  const buttonClass = `transition-all duration-150 transform active:outline-none active:ring-2 active:ring-offset-2 ${className} ${variantClasses[
    variant
  ](mappedColor)} ${sizeClasses[size]} ${shapeClasses[shape]} ${
    disabled || loading ? "opacity-80 cursor-not-allowed" : "cursor-pointer"
  }`;

  const handleClick = (event) => {
    if (onClick) onClick?.(event);
  };
  return (
    <NTooltip title={tooltip} placement={tooltipPlacement}>
      <button
        onClick={(event) => {
          canClick && handleClick(event);
        }}
        disabled={disabled || loading}
        className={buttonClass}
      >
        {loading ? <span className="loader"></span> : children}
      </button>
    </NTooltip>
  );
};

export default NButton;
