// components/InfiniteScroll.tsx
"use client";

import { throttleFunc } from "@/helpers";
import React, { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  hasMore,
  isLoading = false,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Sử dụng useRef để lưu các giá trị mới nhất của props
  const propsRef = useRef({ onLoadMore, hasMore, isLoading });

  useEffect(() => {
    propsRef.current = { onLoadMore, hasMore, isLoading };
  }, [onLoadMore, hasMore, isLoading]);

  const handleScroll = useRef(
    throttleFunc(() => {
      const container = containerRef.current;
      const { onLoadMore, hasMore, isLoading } = propsRef.current;
      if (!container || isLoading || !hasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onLoadMore();
      }
    }, 300)
  ).current;

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

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
