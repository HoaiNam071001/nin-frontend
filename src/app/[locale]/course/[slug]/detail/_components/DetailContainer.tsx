"use client";

import { FullCourse } from "@/models";
import { courseSearchService } from "@/services/courses/course-search.service";
import { toastService } from "@/services/toast.service";
import { useEffect, useState } from "react";
import { CourseSectionMenu } from "./CourseSectionMenu";
import { CourseDetailContent } from "./CourseDetailContent";
import DetailTitle from "./DetailTitle";
import CourseTabContent from "./CourseTabContent";

const DetailContainer = ({ slug }) => {
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
    <>
      {course && (
        <div>
          <div className="mb-2">
            <DetailTitle course={course}></DetailTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-4">
              <CourseDetailContent />
              <CourseTabContent course={course} />
            </div>
            <div className="md:col-span-4">
              <CourseSectionMenu courseId={course.id} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailContainer;
