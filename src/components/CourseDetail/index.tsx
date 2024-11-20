"use client";
import { CourseBasicInfo } from "./CourseBasicInfo";
import { CourseCard } from "./CourseCard";
import CourseContentMenu from "./CourseContentMenu";

const CourseDetail = ({ slug }) => {
  return (
    <div className="mx-auto container h-[80vh] bg-white shadow-lg border space-x-4 border-stroke rounded-lg flex p-7 relative">
      <div className="h-full flex-1 overflow-x-auto space-y-5">
        <CourseBasicInfo />
        <CourseContentMenu/>
      </div>
      <div className="md:col-span-3 sticky top-0 min-w-[350px] w-[350px]">
        <CourseCard />
      </div>
    </div>
  );
};

export default CourseDetail;
