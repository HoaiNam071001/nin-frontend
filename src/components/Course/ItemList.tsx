import React from "react";
import { CourseItem } from ".";

export const ItemList: React.FC = () => {
  return (
    <>
      {/* <div className="grid grid-flow-col grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6 xl:grid-cols-4 2xl:gap-7.5"> */}
      <div className="overflow-auto">
        <div
          className="grid grid-flow-col gap-4 auto-cols-1 sm:auto-cols-2 md:auto-cols-3 lg:auto-cols-4 xl:auto-cols-5"
        >
          {Array.from({ length: 10 }, (_, index) => index + 1).map((course) => (
            <CourseItem key={course} />
          ))}
        </div>
      </div>
    </>
  );
};