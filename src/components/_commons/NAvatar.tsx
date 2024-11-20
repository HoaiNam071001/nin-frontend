import React from "react";
import Image from "next/image";
import { Tooltip } from "antd";

interface AvatarProps {
  src: string; // URL ảnh đại diện
  name?: string;
  alt?: string; // Mô tả thay thế
  size?: "small" | "medium" | "large"; // Kích thước avatar
  className?: string; // Thêm custom class nếu cần
  tooltip?: React.ReactNode | string;
}

const NAvatar: React.FC<AvatarProps> = ({
  src,
  name,
  alt = "Avatar",
  size = "medium",
  className,
  tooltip = <div className="max-w-[300px]">{name}</div>
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-9 h-9",
    large: "w-12 h-12",
  };

  return (
    <Tooltip title={tooltip}>
      <Image 
        src={src}
        alt={alt}
        width={100}
        height={100}
        className={`${sizeClasses[size]} rounded-full border border-gray-300 ${className}`}
      />
    </Tooltip>
  );
};

export default NAvatar;
