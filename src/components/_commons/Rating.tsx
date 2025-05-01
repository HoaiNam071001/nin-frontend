// components/Rating.tsx
"use client";

import { useState } from "react";
import SvgIcon from "./SvgIcon";

interface RatingProps {
  initialValue?: number;
  editable?: boolean;
  onChange?: (value: number) => void;
  activeColor?: string;
  inactiveColor?: string;
  size?: "ssm" | "sm" | "md" | "lg" | "xl";
  maxStars?: number; // Thêm prop maxStars
}

const Rating: React.FC<RatingProps> = ({
  initialValue = 0,
  editable = false,
  onChange,
  size = "md",
  activeColor = "text-yellow-400",
  inactiveColor = "text-gray-300",
  maxStars = 5, // Mặc định là 5 sao
}) => {
  const [rating, setRating] = useState<number>(initialValue);
  const [hover, setHover] = useState<number | null>(null);

  const handleClick = (value: number) => {
    if (!editable) return;
    setRating(value);
    if (onChange) {
      onChange(value);
    }
  };

  // Hiển thị giá trị dựa trên hover hoặc rating
  const displayValue = editable && hover !== null ? hover : initialValue;

  // Logic để xác định trạng thái của từng sao
  const isFullStar = (ratingValue: number) =>
    ratingValue <= Math.floor(displayValue);
  const isHalfStar = (ratingValue: number) =>
    ratingValue === Math.ceil(displayValue) && displayValue % 1 !== 0;

  return (
    <div className="flex gap-1">
      {[...Array(maxStars)].map((_, index) => {
        const ratingValue = index + 1;
        const fullStar = isFullStar(ratingValue);
        const halfStar = isHalfStar(ratingValue);

        return (
          <div
            key={index}
            className={`cursor-${
              editable ? "pointer" : "default"
            } relative icon-${size}`}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => editable && setHover(ratingValue)}
            onMouseLeave={() => editable && setHover(null)}
          >
            {/* Sao nền (inactive) */}
            <SvgIcon
              icon="star"
              className={`icon icon-${size} ${inactiveColor}`}
            />
            {/* Sao active hoặc nửa sao */}
            {(fullStar || halfStar) && (
              <div
                className="absolute top-0 left-0"
                style={{
                  clipPath: halfStar ? "inset(0 50% 0 0)" : "none", // Cắt nửa bên phải
                }}
              >
                <SvgIcon
                  icon="star"
                  className={`icon icon-${size} ${activeColor}`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Rating;
