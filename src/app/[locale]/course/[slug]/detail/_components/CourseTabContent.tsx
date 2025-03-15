"use client";

import React, { useContext, useState, useMemo } from "react";
import CourseOverviewTab from "./CourseOverviewTab";
import CourseContentFile from "./CourseContentFile";
import { CourseComment } from "../../_components/CourseComment";
import { CourseDetailContext } from "../page";
import NButton from "@/components/_commons/NButton";

const CourseTabContent = ({ course }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { section } = useContext(CourseDetailContext);

  // Sử dụng useMemo để tính toán mảng tabs
  const tabs = useMemo(() => {
    return [
      {
        id: "overview",
        label: "Tổng quan",
        component: <CourseOverviewTab course={course} />,
      },
      {
        id: "reviews",
        label: "Đánh giá",
        component: <CourseComment courseId={course.id} />,
      },
      section
      ? {
          id: "curriculum",
          label: "Tài Liệu",
          component: <CourseContentFile course={course} />,
        }
      : null,
    ].filter(Boolean);
  }, [course, section]); // Dependencies: course và section

  return (
    <>
      {course && (
        <div className="grid gap-4">
          <div className="flex border-b border-stroke">
            {tabs.map((tab) => (
              <NButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                variant="link"
                color="black"
                shape="none"
                className={`${
                  activeTab === tab.id
                    ? "border-b-2 border-system text-system"
                    : "border-b-2 border-transparent"
                }`}
              >
                {tab.label}
              </NButton>
            ))}
          </div>
          <div className="mt-2">
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseTabContent;
