"use client";

import NAvatar from "../_commons/NAvatar";
import SvgIcon from "../_commons/SvgIcon";
import ExpandableContent from "../_commons/ExpandableContent";
import { FullCourse } from "@/models";
import CourseTopics from "./CourseTopics";
import CourseTargetList from "./CourseTargetList";

export const CourseBasicInfo = ({
  course,
  showView = false,
}: {
  course: FullCourse;
  showView?: boolean;
}) => {
  return (
    <div className="space-y-2">
      <div>
        <div className="line-clamp-2 text-title-md font-semibold">
          {course?.name}
        </div>
        {course?.summary && (
          <div className="text-slate-400">{course?.summary}</div>
        )}
      </div>

      {course?.owner && (
        <div className="flex items-center space-x-2">
          <NAvatar
            tooltip=""
            src={course?.owner?.avatar}
            name={course?.owner?.fullName}
            userId={course?.owner?.id}
            email={course?.owner?.email}
            showName={true}
          />
        </div>
      )}

      <div className="flex justify-between">
        {showView && (
          <>
            <div className="flex items-center space-x-2 w-[200px]">
              <SvgIcon
                icon="star"
                className="fill-system text-system icon icon-sm"
              ></SvgIcon>
              <span>4.7 (200,000 reviews) </span>
            </div>

            <div className="flex items-center space-x-2 w-[200px]">
              <SvgIcon icon="group" className="icon icon-sm"></SvgIcon>
              <span>1,000 students </span>
            </div>
          </>
        )}

        {course?.level && (
          <div className="flex items-center space-x-2 w-[200px]">
            <SvgIcon icon="lightning" className="icon icon-sm"></SvgIcon>
            <span>{course.level.name} </span>
          </div>
        )}
      </div>

      <CourseTopics course={course} />

      <CourseTargetList items={course?.targets}/>

      <div>
        <ExpandableContent content={course?.description} height={200} />
      </div>
    </div>
  );
};
