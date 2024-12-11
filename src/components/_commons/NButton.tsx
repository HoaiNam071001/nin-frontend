import { Tooltip } from "antd";
import React from "react";

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
    | "primary"
    | "secondary-black"
    | "secondary-gray"
    | "white"
    | "transparent"
    | "primary-outline"; // Button color variant
  onClick?: () => void; // Function to call when button is clicked
  loading?: boolean; // If true, show loading spinner
  disabled?: boolean; // If true, disable the button
  shape?: "sm" | "md" | "lg" | "xl" | "xxl"; // Border radius shape for the button
  className?: string;
  tooltip?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  onClick,
  loading = false,
  disabled = false,
  shape = "md", // Default to medium shape
  className,
  tooltip = "",
}) => {
  // Define styles for different button sizes
  const sizeClasses = {
    sm: "text-xs px-2 py-1", // Small size
    md: "text-base px-3 py-1", // Medium size (default)
    lg: "text-lg px-4 py-2", // Large size
    xl: "text-xl px-8 py-3", // Extra large size
    xxl: "text-2xl px-10 py-4", // Double extra large size
    "sm-circle": "text-xs p-1", // Small size
    "md-circle": "text-base p-2", // Medium size (default)
    "lg-circle": "text-lg p-2", // Large size
    "xl-circle": "text-xl p-4", // Extra large size
    "xxl-circle": "text-2xl p-5", // Double extra large size
  };

  // Define styles for different button variants
  const variantClasses = {
    primary: "bg-system text-white hover:bg-blue-600",
    "secondary-black":
      "bg-white border border-black text-black hover:bg-gray-100",
    "secondary-gray":
      "bg-white border border-gray-400 text-gray-400 hover:bg-gray-100",
    "primary-outline":
      "bg-white border border-system text-system hover:bg-system hover:text-white",
    white: "bg-white text-gray-400 hover:bg-gray-100",
    transparent: "bg-transparent hover:bg-transparent",
  };

  // Define styles for different border radius shapes
  const shapeClasses = {
    sm: "rounded-sm", // Small border radius
    md: "rounded-md", // Medium border radius (default)
    lg: "rounded-lg", // Large border radius
    xl: "rounded-xl", // Extra large border radius
    xxl: "rounded-full", // Double extra large border radius
  };

  return (
    <Tooltip title={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`${className} ${variantClasses[variant]} ${
          sizeClasses[size]
        } ${shapeClasses[shape]} ${disabled || loading ? "opacity-80" : ""}`}
      >
        {loading ? <span className="loader"></span> : children}
      </button>
    </Tooltip>
  );
};

export default CustomButton;
