"use client";

import React, { useState, useMemo } from "react";
import NButton from "@/components/_commons/NButton";
import UserCollaboration from "./UserCollaboration";
import UserCourseList from "./UserCourseList";

const UseTab = ({ user }) => {
  // Sử dụng useMemo để tính toán mảng tabs
  const tabs = useMemo(() => {
    return [
      {
        id: "bookmarks",
        label: "Khóa học đã tạo",
        component: <UserCourseList userId={user?.id} />,
      },
      {
        id: "collaborator",
        label: "Khóa học đóng góp",
        component: <UserCollaboration userId={user?.id} />,
      },
    ];
  }, []);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="w-full">
      <div className="flex border-b border-stroke w-full">
        {tabs.map((tab) => (
          <NButton
            key={tab.id}
            onClick={() => setActiveTab(tab)}
            variant="link"
            color="black"
            shape="none"
            className={`${
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
