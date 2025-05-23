"use client";

import NButton from "@/components/_commons/NButton";
import useAuth from "@/hooks/useAuth";
import { useMemo, useState } from "react";
import UserCollaboration from "./UserCollaboration";
import UserCourseList from "./UserCourseList";

const UseTab = ({ user }) => {
  const { currentUser } = useAuth();
  // Sử dụng useMemo để tính toán mảng tabs
  const tabs = useMemo(() => {
    return [
      {
        id: "bookmarks",
        label: "Courses Created",
        component: <UserCourseList userId={user?.id} />,
      },
      currentUser?.id === user?.id && {
        id: "collaborator",
        label: "Contributed Courses",
        component: <UserCollaboration userId={user?.id} />,
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
