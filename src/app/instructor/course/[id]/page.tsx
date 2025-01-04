"use client";

import React, { useEffect, useState } from "react";
import { CourseStepItem, CourseSteps, StepType, Course } from "@/models";
import CourseSetting from "@/components/CourseSetting";
import { CourseTargetComponent } from "@/components/CourseSetting/CourseTarget";
import { findIndex } from "lodash";
import { CourseOverview } from "@/components/CourseSetting/CourseOverview";
import { CourseContent } from "@/components/CourseSetting/CourseContent";
import { CoursePermisison } from "@/components/CourseSetting/CoursePermission";
import { courseService } from "@/services/course.service";
import { toastService } from "@/services/toast.service";
import Loader from "@/components/_commons/Loader";
import useAuth from "@/hooks/useAuth";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/constants";

const CourseEdit: React.FC = () => {
  const { id } = useParams();
  const [currentStep, setStep] = useState<CourseStepItem>(CourseSteps[0]);
  const router = useRouter();
  const [course, setCourse] = useState<Course>();
  const [loading, setLoading] = useState<boolean>(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const getCourse = async () => {
      if (isNaN(+id)) {
        return router.push(ROUTES.HOME);
      }
      try {
        setLoading(true);
        const response: Course = await courseService.getCourseById(+id);
        if (response?.owner?.id !== currentUser.id) {
          return router.push(ROUTES.HOME);
        }
        setCourse(response);
        setLoading(false);
      } catch (error) {
        toastService.error(error?.message);
        setLoading(false);
      }
    };
    getCourse();
  }, [id, currentUser, router]);

  const onChangeStep = (step: CourseStepItem) => {
    setStep(step);
  };

  const moveToNextStep = () => {
    const index = findIndex(CourseSteps, (e) => e.type === currentStep.type);
    if (CourseSteps[index + 1]) {
      onChangeStep(CourseSteps[index + 1]);
    }
  };

  const moveToPrevStep = () => {
    const index = findIndex(CourseSteps, (e) => e.type === currentStep.type);
    if (CourseSteps[index - 1]) {
      onChangeStep(CourseSteps[index - 1]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mx-auto h-[calc(100vh-130px)] bg-gray-1 rounded-sm grid grid-cols-1 md:grid-cols-10 gap-4 p-4">
      <div className="md:col-span-2 h-full">
        <CourseSetting
          currentStep={currentStep.type}
          setStep={onChangeStep}
        ></CourseSetting>
      </div>
      <div className="md:col-span-8 bg-white h-full max-h-full rounded-sm flex flex-col overflow-hidden">
        <div className="text-title-sm font-semibold px-4 py-2 z-10 bg-white">
          {currentStep?.label}
        </div>
        <div className="m-4 relative flex-1 overflow-auto flex flex-col">
          {currentStep.type === StepType.Target && (
            <CourseTargetComponent
              course={course}
              moveToNextStep={() => moveToNextStep()}
            />
          )}

          {currentStep.type === StepType.OverView && (
            <CourseOverview
              moveToNextStep={() => moveToNextStep()}
              moveToPrevStep={() => moveToPrevStep()}
              course={course}
              setCourse={setCourse}
            />
          )}
          {currentStep.type === StepType.Content && (
            <CourseContent
              moveToNextStep={() => moveToNextStep()}
              moveToPrevStep={() => moveToPrevStep()}
              course={course}
            />
          )}

          {currentStep.type === StepType.RolePermission && (
            <CoursePermisison
              moveToNextStep={() => moveToNextStep()}
              moveToPrevStep={() => moveToPrevStep()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEdit;
