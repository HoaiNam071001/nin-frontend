"use client";

import React from "react";
import { CourseItem } from ".";
import { Course } from "@/models";

export const ItemList = ({ courses }: { courses?: Course[] }) => {
  return (
    <>
      <div className="overflow-auto">
        <div className="grid grid-flow-col gap-4 auto-cols-1 sm:auto-cols-2 md:auto-cols-3 lg:auto-cols-4 xl:auto-cols-5">
          {courses?.map((course, index) => (
            <CourseItem key={index} course={course} />
          ))}
        </div>
      </div>
    </>
  );
};
