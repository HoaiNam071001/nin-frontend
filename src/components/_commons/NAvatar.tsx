import React from "react";
import Image from "next/image";
import { Tooltip } from "antd";
import { getAbbreviatedName } from "@/helpers";

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
  tooltip = <div className="max-w-[300px]">{name}</div>,
}) => {
  const sizeClasses = {
    small: "w-6 h-6 max-w-6 min-w-6",
    medium: "w-9 h-9 max-w-9 min-w-9",
    large: "w-12 h-12 max-w-12 min-w-12",
  };

  return (
    <Tooltip title={tooltip}>
      {/* <div className={`${sizeClasses[size]} border border-slate-200 rounded-full`}> */}
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={100}
          height={100}
          className={`${sizeClasses[size]} rounded-full border border-white ${
            className || ""
          }`}
        />
      ) : (
        <div
          className={`${
            sizeClasses[size]
          } rounded-full border border-white text-white bg-system flex items-center text-[13px] justify-center ${
            className || ""
          }`}
        >
          <span>{getAbbreviatedName(name)}</span>
        </div>
      )}

      {/* </div> */}
    </Tooltip>
  );
};

export default NAvatar;
