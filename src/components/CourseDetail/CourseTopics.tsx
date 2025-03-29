"use client";

import { Category, FullCourse } from "@/models";

const CourseTopics = ({ course }: { course: FullCourse }) => {
  const onNavigate = (category: Category) => {};

  return (
    <div className="flex items-center flex-wrap gap-4">
      {course?.topics?.map?.((e, idx) => (
        <div
          key={idx}
          className="px-3 py-1 bg-system bg-opacity-15 rounded-full"
        >
          <span>{e.name}</span>
        </div>
      ))}
    </div>
  );
};

export default CourseTopics;
