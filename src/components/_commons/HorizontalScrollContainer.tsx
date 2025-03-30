"use client";

import debounce from "lodash/debounce";
import { useEffect, useRef, useState } from "react";
import NButton from "./NButton";
import SvgIcon from "./SvgIcon";

const HorizontalScrollContainer = ({
  children,
  scrollOffset = 200,
  onScrollChange,
  loadMoreThreshold = 80,
  onLoadMore,
}: {
  children: React.ReactNode;
  scrollOffset?: number | string;
  onScrollChange?: (percentage: number) => void;
  loadMoreThreshold?: number;
  onLoadMore?: () => void;
}) => {
  const containerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (offset, isRight = true) => {
    if (containerRef.current) {
      // Kiểm tra nếu scrollOffset là dạng phần trăm
      if (typeof offset === "string" && offset.endsWith("%")) {
        const percentage = parseInt(offset, 10);
        const containerWidth = containerRef.current.offsetWidth;
        const offsetPixels = (percentage / 100) * containerWidth;
        if (isRight) {
          containerRef.current.scrollLeft += offsetPixels;
        } else {
          containerRef.current.scrollLeft -= offsetPixels;
        }
      } else {
        if (isRight) {
          containerRef.current.scrollLeft += offset;
        } else {
          containerRef.current.scrollLeft -= offset;
        }
      }
    }
  };

  const updateScrollState = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft + container.clientWidth <
          container.scrollWidth - 10
      );

      const scrollPercentage =
        (container.scrollLeft /
          (container.scrollWidth - container.clientWidth)) *
        100;

      if (onScrollChange) {
        onScrollChange(scrollPercentage);
      }
    }
  };

  const debouncedHandleScroll = debounce(() => {
    updateScrollState();

    // Chỉ kiểm tra loadMore khi cuộn
    if (containerRef.current && onLoadMore) {
      const container = containerRef.current;
      const scrollPercentage =
        (container.scrollLeft /
          (container.scrollWidth - container.clientWidth)) *
        100;
      if (scrollPercentage >= loadMoreThreshold) {
        onLoadMore();
      }
    }
  }, 500);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.addEventListener("scroll", debouncedHandleScroll);
      updateScrollState(); // Initial check
      return () =>
        container.removeEventListener("scroll", debouncedHandleScroll);
    }
  }, []);

  useEffect(() => {
    updateScrollState();
  }, [children]);

  return (
    <div className="relative group">
      {showLeftArrow && (
        <NButton
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => scroll(scrollOffset, false)}
          shape="full"
          size="md-circle"
          variant="filled"
        >
          <SvgIcon icon={"arrow"} className="icon icon-md -rotate-90" />
        </NButton>
      )}
      <div
        ref={containerRef}
        className="overflow-hidden whitespace-nowrap scroll-smooth"
      >
        {children}
      </div>

      {showRightArrow && (
        <NButton
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
          onClick={() => scroll(scrollOffset)}
          shape="full"
          size="md-circle"
          variant="filled"
        >
          <SvgIcon icon={"arrow"} className="icon icon-md rotate-90" />
        </NButton>
      )}
    </div>
  );
};

export default HorizontalScrollContainer;
