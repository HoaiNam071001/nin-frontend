"use client";

import { Button } from "antd";
import SvgIcon from "../_commons/SvgIcon";
import { SectionMenu } from "../CourseItem/SectionMenu";
import { FullCourse } from "@/models";
import HMSDisplay from "../_commons/HMSDisplay";

const CourseContentMenu = ({ course }: { course: FullCourse }) => {
  return (
    <div className="space-y-3 pt-2">
      <div className="font-semibold text-title-sm">Course Content</div>
      <div className="flex items-center text-gray-400">
        <span>{course.totalSection} lessons </span>
        <SvgIcon icon="dot" className="icon icon-sm"></SvgIcon>
        <span>
          <HMSDisplay seconds={course.estimatedTime} />
        </span>

      </div>
      <SectionMenu courseId={course.id} />
    </div>
  );
};

export default CourseContentMenu;
