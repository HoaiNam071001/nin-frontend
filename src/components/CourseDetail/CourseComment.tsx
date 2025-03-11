"use client";

import NAvatar from "../_commons/NAvatar";
import { FullCourse } from "@/models";

export const CourseComment = ({ course }: { course: FullCourse }) => {
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Bình luận</h2>
        <div className="flex items-center space-x-2">
          <span>↑↓</span>
          <span>Gần đây nhất</span>
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <NAvatar
                tooltip=""
                src={course?.owner?.avatar}
                name={course?.owner?.fullName}
              />
              <div className="font-semibold ">{course.owner.fullName}</div>
            </div>
            <span className=" text-gray-500">40 phút trước</span>
          </div>
          <div className="ml-[45px]">
          <p className="">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <div className="flex items-center space-x-4  text-gray-600 mt-2">
            <span className="flex items-center">

              20
            </span>
            <span className="flex items-center">

              20
            </span>
            <span>Hồi đáp</span>
          </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
