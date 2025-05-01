"use client";

import NButton from "@/components/_commons/NButton";
import { useMemo, useState } from "react";
import CoursePay from "./CoursePay";
import RatingTab from "./CourseRatingTab";

const UseTab = () => {
  // Sử dụng useMemo để tính toán mảng tabs
  const tabs = useMemo(() => {
    return [
      {
        id: "pay",
        label: "Revenue",
        component: <CoursePay />,
      },
      {
        id: "rating",
        label: "Rating",
        component: <RatingTab />,
      },
    ];
  }, []);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="w-full">
      <div className="flex border-b border-stroke w-full bg-slate-50">
        {tabs.map((tab) => (
          <NButton
            key={tab.id}
            onClick={() => setActiveTab(tab)}
            variant="link"
            color="black"
            shape="none"
            className={`py-2 ${
              activeTab.id === tab.id
                ? "border-b-2 border-system text-system"
                : "border-b-2 border-transparent"
            }`}
          >
            {tab.label}
          </NButton>
        ))}
      </div>
      <div className="mt-4 w-full">{activeTab?.component}</div>
    </div>
  );
};

export default UseTab;
