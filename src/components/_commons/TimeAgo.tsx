// components/TimeAgo.tsx
import React from "react";
import NTooltip from "./NTooltip";
import { formatDate } from "@/helpers/date";
import { DATE_FORMATS } from "@/constants";

interface TimeAgoProps {
  date: string;
  className?: string;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ date, className }) => {
  const getTimeAgo = (dateString: string): string => {
    const inputDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - inputDate.getTime()) / 1000
    );

    const intervals = [
      { label: "năm", seconds: 31536000 }, // 365 * 24 * 60 * 60
      { label: "tháng", seconds: 2592000 }, // 30 * 24 * 60 * 60
      { label: "ngày", seconds: 86400 }, // 24 * 60 * 60
      { label: "giờ", seconds: 3600 }, // 60 * 60
      { label: "phút", seconds: 60 },
      { label: "giây", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label} trước`;
      }
    }

    return "vừa xong";
  };

  return (
    <NTooltip
      title={date && formatDate({
        date,
        format: DATE_FORMATS.SHORT_DATE_TIME,
      })}
    >
      <span className={className}>{getTimeAgo(date)} </span>
    </NTooltip>
  );
};

export default TimeAgo;
