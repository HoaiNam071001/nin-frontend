// components/InfiniteScroll.tsx
"use client";

import { throttleFunc } from "@/helpers";
import React, { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  getRef?: (ref: HTMLDivElement) => void;
  hasMore: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  direction?: "up" | "down";
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  getRef,
  hasMore,
  isLoading = false,
  children,
  direction = "down", // Mặc định là "down"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ onLoadMore, hasMore, isLoading, direction });

  useEffect(() => {
    propsRef.current = { onLoadMore, hasMore, isLoading, direction };
  }, [onLoadMore, hasMore, isLoading, direction]);

  const handleScroll = useRef(
    throttleFunc(() => {
      const container = containerRef.current;
      const { onLoadMore, hasMore, isLoading, direction } = propsRef.current;
      if (!container || isLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      console.log(scrollTop, scrollHeight, clientHeight);
      if (direction === "down") {
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          onLoadMore();
        }
      } else if (direction === "up") {
        if (scrollTop <= 100) {
          onLoadMore();
        }
      }
    }, 500)
  ).current;

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    getRef?.(container);

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full overflow-auto">
      {children}
    </div>
  );
};

export default InfiniteScroll;
