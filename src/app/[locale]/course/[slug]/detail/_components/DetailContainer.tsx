"use client";

import { FullCourse } from "@/models";
import { courseSearchService } from "@/services/courses/course-search.service";
import { toastService } from "@/services/toast.service";
import { useEffect, useState } from "react";
import { CourseDetailContent } from "./CourseDetailContent";
import { CourseSectionMenu } from "./CourseSectionMenu";
import CourseTabContent from "./CourseTabContent";
import DetailTitle from "./DetailTitle";

const DetailContainer = ({ slug }) => {
  const [course, setCourse] = useState<FullCourse>();
  const [loading, setLoading] = useState<boolean>(true);
  const [collapsed, setCollapsed] = useState(false);

  const getBySlug = async () => {
    try {
      setLoading(true);
      const response: FullCourse = await courseSearchService.getBySlug(slug);
      setCourse(response);
      setLoading(false);
    } catch (error) {
      toastService.error(error?.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBySlug();
  }, [slug]);

  return (
    <>
      {course && (
        <div className="transition-all duration-300 ease-in-out">
          <div className="flex flex-col md:flex-row gap-4">
            <div
              className={`flex-1 space-y-4 transition-all duration-300 ease-in-out ${
                collapsed ? "max-w-full" : "md:max-w-[66.7%]"
              }`}
            >
              <DetailTitle
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                course={course}
              />
              <CourseDetailContent />
              <CourseTabContent course={course} />
            </div>
            {!collapsed && (
              <div className="md:w-[33.3%] transition-all duration-300 ease-in-out opacity-100">
                <CourseSectionMenu courseId={course.id} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DetailContainer;
