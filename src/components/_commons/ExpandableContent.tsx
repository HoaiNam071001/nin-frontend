"use client";

import React, { useEffect, useRef, useState } from "react";

interface ExpandableContentProps {
  content: string; // Nội dung dài
  height: number; //
  showMoreLabel?: React.ReactNode | string;
  showLessLabel?: React.ReactNode | string;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({
  content,
  height = 300,
  showMoreLabel = "Show More",
  showLessLabel = "Show Less",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const maskImageStyle = {
    WebkitMaskImage: "linear-gradient(#ffffff, #ffffff, rgba(255, 255, 255, 0))",
    maskImage: "linear-gradient(#ffffff, #ffffff, rgba(255, 255, 255, 0))",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };
  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      setIsOverflowing(contentElement.scrollHeight > height);
    }
  }, []);

  return (
    <div className="">
      {/* Vùng nội dung */}
      <div className="relative">
        <div
          ref={contentRef}
          className={`overflow-hidden duration-300`}
          style={{
            'maxHeight':  isExpanded ? '100%' : `${height}px`,
            ...((isExpanded || !isOverflowing) ? {} : maskImageStyle)
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>

        {/* {!isExpanded && isOverflowing && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
        )} */}
      </div>

      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-system rounded hover:text-system transition hover:underline"
        >
          {isExpanded ? showLessLabel : showMoreLabel}
        </button>
      )}
    </div>
  );
};

export default ExpandableContent;
