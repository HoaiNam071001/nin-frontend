"use client";

import { Button } from "antd";
import SvgIcon from "../_commons/SvgIcon";
import { SectionMenu } from "../CourseItem/SectionMenu";
import { Course, FullCourse } from "@/models";

const CourseContentMenu = ({
  course,
}: {
  course: Course | FullCourse; 
}) => {
  return (
    <div className="space-y-3">
      
      <div className="font-semibold text-title-sm">Course Content</div>
      <div className="flex items-center text-gray-400">
        <span>20 sections </span>
        <SvgIcon icon="dot" className="icon icon-sm"></SvgIcon>
        <span>30h 20m total length</span>

        <Button type="link">Link</Button>
      </div>
      <SectionMenu courseId={course.id}/>
    </div>
  );
};

export default CourseContentMenu;
