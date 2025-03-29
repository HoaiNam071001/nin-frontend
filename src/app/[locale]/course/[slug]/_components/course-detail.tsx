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
import { cartService } from "@/services/user/cart.service";
import { CourseComment } from "./CourseComment";
import CourseReviews from "./CourseRating";

const CourseDetail = ({ slug }) => {
  const [course, setCourse] = useState<FullCourse>();

  const addToCart = async () => {
    try {
      await cartService.addItem(course?.id);
      toastService.success("Course added to cart successfully.");
    } catch (err: any) {
      toastService.error("Failed to update quantity.");
    }
  };

  const getBySlug = async () => {
    try {
      const response: FullCourse = await courseSearchService.getBySlug(slug);
      setCourse(response);
    } catch (error) {
      toastService.error(error?.message);
    }
  };
  useEffect(() => {
    getBySlug();
  }, [slug]);
  return (
    <div className="mx-auto bg-white space-x-4  flex p-4">
      {course && (
        <div className="h-full flex-1 overflow-x-auto">
          <div className="mb-3">
            <CourseBreadcrumb course={course} />
          </div>
          <div className="mb-3">
            <CourseBasicInfo course={course} />
          </div>
          <div className="mb-5">
            <CourseContentMenu course={course} />
          </div>
          <CourseReviews course={course} />
        </div>
      )}
      <div className="md:col-span-3 sticky top-[200px] min-w-[350px] w-[350px]">
        {course && <CourseCard course={course} addToCart={addToCart} />}
      </div>
    </div>
  );
};

export default CourseDetail;
