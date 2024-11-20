"use client";

import { useState } from "react";
import SvgIcon from "../_commons/SvgIcon";

export const SectionMenu = () => {
  return (
    <div className="space-y-2 border border-stroke rounded-md overflow-hidden">
      {[0, 0, 0, 0, 0].map((e, index) => (
        <SectionTree key={index} />
      ))}
    </div>
  );
};

const SectionTree = () => {
  const [isExpand, setExpand] = useState(false);

  const onToggle = () => {
    setExpand(!isExpand);
  };

  return (
    <div className="">
      <div
        onClick={onToggle}
        className="flex items-center flex-nowrap bg-slate-100 p-3 rounded-sm cursor-pointer"
      >
        <SvgIcon
          icon="arrow"
          className={`icon icon-sm transition-[0.5s] ${
            isExpand ? "rotate-180" : "rotate-90"
          }`}
        ></SvgIcon>

        <span className="font-semibold line-clamp-2 mr-4 ml-2">
          Section Name Section NameSection NameSection NameSection NameSection
          NameSection NameSection NameSection Name
        </span>
        <span className="ml-auto whitespace-nowrap">30 minutes</span>
      </div>

      {isExpand &&
        [0, 0, 0, 0, 0].map((e, index) => (
          <div
            key={index}
            className="flex items-center gap-4 pl-4 pr-3 py-2 rounded bg-white hover:bg-slate-50 cursor-pointer"
          >
            <SvgIcon icon="video-file" className="icon icon-md"></SvgIcon>
            <span className="">Section Name</span>
            <span className="ml-auto">30:10</span>
          </div>
        ))}
    </div>
  );
};
