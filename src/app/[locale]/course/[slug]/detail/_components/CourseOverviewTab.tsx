"use client";

import { CourseTargetType, FullCourse } from "@/models";
import React, { useEffect, useState } from "react";
import CourseTargetList from "../../../../../../components/CourseDetail/CourseTargetList";
import NEditor from "@/components/_commons/NEditor";

// Component cho tab Tổng quan
const CourseOverviewTab = ({ course }: { course: FullCourse }) => {

  return (
    <div>
      <div className="text-title-sm font-semibold mb-4">{course.summary}</div>
      <NEditor value={course.description} readOnly={true}/>

      <CourseTargetList items={course?.targets} />
    </div>
  );
};

export default CourseOverviewTab;
