"use client";

import { Course } from "@/models";
import { CourseItem } from ".";

export const ItemList = ({
  courses,
  viewDetail,
}: {
  courses?: Course[];
  viewDetail?: boolean;
}) => {
  return (
    <>
      <div className="grid grid-flow-col gap-4 auto-cols-1 sm:auto-cols-2 md:auto-cols-3 lg:auto-cols-4 xl:auto-cols-5">
        {courses?.map((course, index) => (
          <CourseItem key={index} course={course} viewDetail={viewDetail} />
        ))}
      </div>
    </>
  );
};
