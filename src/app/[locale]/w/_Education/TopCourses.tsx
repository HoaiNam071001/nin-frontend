import I18n from "@/components/_commons/I18n";
import { ItemList } from "@/components/CourseItem/ItemList";
import React from "react";

type TopCourseProps = {
  title: string;
  children?: React.ReactNode;
};

export const TopCourses: React.FC<TopCourseProps> = ({ title, children }) => {
  return (
    <>
      <div className="text-title-sm font-semibold mb-1">
        <I18n i18key={title}></I18n>
      </div>
      {children}
      <div className="mt-4">
        <ItemList></ItemList>
      </div>
    </>
  );
};
