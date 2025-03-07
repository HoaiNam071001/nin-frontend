"use client";

import { CourseBasicInfo } from "@/components/CourseDetail/CourseBasicInfo";
import { CourseCard } from "@/components/CourseDetail/CourseCard";
import CourseContentMenu from "@/components/CourseDetail/CourseContentMenu";
import useAuth from "@/hooks/useAuth";
import { FullCourse } from "@/models";
import { courseSearchService } from "@/services/courses/course-search.service";
import { toastService } from "@/services/toast.service";
import { useEffect, useState } from "react";
import CourseBreadcrumb from "./course-breadcrumb";

const CourseDetail = ({ slug }) => {
  const { currentUser } = useAuth();
  const [course, setCourse] = useState<FullCourse>();
  const [loading, setLoading] = useState<boolean>(true);

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
    <div className="mx-auto bg-white shadow-lg border space-x-4 border-stroke rounded-lg flex p-4">
      {course && (
        <div className="h-full flex-1 overflow-x-auto space-y-2">
          <CourseBreadcrumb course={course} />
          <CourseBasicInfo course={course} />
          <CourseContentMenu course={course} />
        </div>
      )}
      <div className="md:col-span-3 sticky top-[200px] min-w-[350px] w-[350px]">
        <CourseCard />
      </div>
    </div>
  );
};

export default CourseDetail;
