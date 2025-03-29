import React from "react";
import Image from "next/image";
import { Tooltip } from "antd";
import { getAbbreviatedName } from "@/helpers";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { ROUTES } from "@/constants";

export interface AvatarProps {
  src: string; // URL ảnh đại diện
  name?: string;
  alt?: string; // Mô tả thay thế
  size?: "sm" | "md" | "lg" | "xl" | "xxl"; // Kích thước avatar
  className?: string; // Thêm custom class nếu cần
  tooltip?: React.ReactNode | string;
  showName?: boolean;
  userId?: number;
  email?: string;
}

const NAvatar: React.FC<AvatarProps> = ({
  src,
  name,
  alt = "Avatar",
  size = "md",
  className,
  showName = false,
  email,
  userId,
  tooltip = <div className="max-w-[300px]">{name}</div>,
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 max-w-6 min-w-6 text-[13px]",
    md: "w-9 h-9 max-w-9 min-w-9 text-[13px]",
    lg: "w-12 h-12 max-w-12 min-w-12 text-[13px]",
    xl: "w-24 h-24 max-w-24 min-w-24 text-[30px]",
    xxl: "w-40 h-40 max-w-40 min-w-40 text-[50px]",
  };
  const router = useI18nRouter();

  const onNavigate = (event) => {
    if (!userId) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    router.push(`${ROUTES.USER}/${userId}`);
  };

  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={onNavigate}
    >
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
            } rounded-full border border-white text-white flex items-center justify-center bg-gradient-to-r from-system to-system-300 ${
              className || ""
            }`}
          >
            <span>{getAbbreviatedName(name)}</span>
          </div>
        )}

        {/* </div> */}
      </Tooltip>
      {showName && (
        <div className="flex flex-col space-y-1 leading-[1rem]">
          <div className="capitalize">{name}</div>
          {email && <div className="font-[12px] text-secondary">{email}</div>}
        </div>
      )}
    </div>
  );
};

export default NAvatar;
