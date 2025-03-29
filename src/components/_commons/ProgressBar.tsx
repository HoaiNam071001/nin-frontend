// components/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  value: number; // Giá trị phần trăm (0-100)
  showText?: boolean; // Hiển thị text phần trăm hay không
  size?: "sm" | "md" | "lg"; // Kích thước
  activeColor?: string; // Màu của phần active
  inactiveColor?: string; // Màu của phần inactive
  className?: string; // Class tùy chỉnh
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showText = true,
  size = "md",
  activeColor = "bg-system",
  inactiveColor = "bg-gray-200",
  className = "",
}) => {
  // Đảm bảo giá trị nằm trong khoảng 0-100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  // Xác định chiều cao dựa trên size
  const heightClass = {
    sm: "h-1",
    md: "h-2",
    lg: "h-4",
  }[size];

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Thanh tiến trình */}
        <div
          className={`w-full ${heightClass} ${inactiveColor} rounded-full overflow-hidden transition-all duration-300`}
        >
          <div
            className={`${heightClass} ${activeColor} rounded-full transition-all duration-300`}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
      {/* Text phần trăm (nếu showText = true) */}
      {showText && (
        <span className="text-sm text-gray-600 font-medium">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;
