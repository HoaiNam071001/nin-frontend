"use client";

import SvgIcon from "@/components/_commons/SvgIcon";
import { Category, FullCourse } from "@/models";

const CourseBreadcrumb = ({ course }: { course: FullCourse }) => {

    const onNavigate = (category: Category) => {

    }

  return (
    <div className="flex items-center gap-1 text-system">
      {!!course?.category?.name && (
        <div className="cursor-pointer hover:underline" onClick={()=> onNavigate(course?.category)}>
          {course?.category?.name}
        </div>
      )}
      {!!course?.subCategory?.name && (
        <>
        <SvgIcon className="icon icon-sm rotate-90" icon={'arrow'}></SvgIcon>
        <div className="cursor-pointer hover:underline" onClick={()=> onNavigate(course?.subCategory)}>
          {course?.subCategory?.name}
        </div>
        </>
        
      )}
    </div>
  );
};

export default CourseBreadcrumb;
