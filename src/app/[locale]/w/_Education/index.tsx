"use client";

import React from "react";

import { SectionProgressList } from "@/app/[locale]/w/_Education/SectionProgressList";
import { CourseProgressList } from "./CourseProgressList";
import { NewCourses } from "./NewCourses";
import { TopRating } from "./TopRatings";

const Education: React.FC = () => {
  const tabs = [
    {
      id: 1,
      label: "Web development",
    },
    {
      id: 2,
      label: "Communication",
    },
  ];
  return (
    <>
      <div className=" container mx-auto">
        <div className="mb-4">
          <SectionProgressList />
        </div>

        <div className="mb-4">
          <CourseProgressList />
        </div>

        <div className="mb-4">
          <NewCourses />
        </div>

        <div className="mb-4">
          <TopRating />
        </div>
      </div>
    </>
  );
};

export default Education;
