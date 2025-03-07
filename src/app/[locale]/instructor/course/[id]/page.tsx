"use client";

import React, { useEffect, useState } from "react";
import { CourseStepItem, CourseSteps, StepType, Course } from "@/models";
import { findIndex } from "lodash";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";
import Loader from "@/components/_commons/Loader";
import useAuth from "@/hooks/useAuth";
import { useParams } from "next/navigation";
import { CourseStatus, ROUTES } from "@/constants";
import CourseSetting from "./_components";
import { CoursePermisison } from "./_components/CoursePermission";
import { CourseTargetComponent } from "./_components/CourseTarget";
import { CourseOverview } from "./_components/CourseOverview";
import { CourseContent } from "./_components/CourseContent";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { CoursePayment } from "./_components/CoursePayment";
import NButton from "@/components/_commons/NButton";
import I18n from "@/components/_commons/I18n";
import StatusBadge from "@/components/CourseItem/StatusBadge";

const CourseEdit: React.FC = () => {
  const { id } = useParams();
  const [currentStep, setStep] = useState<CourseStepItem>(CourseSteps[0]);
  const router = useI18nRouter();
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
  }, [id, currentUser]);

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
          course={course}
          setCourse={setCourse}
        ></CourseSetting>
      </div>
      <div className="md:col-span-8 bg-white h-full max-h-full rounded-sm flex flex-col overflow-hidden">
        <div className="flex items-center px-4 pt-4">
          <div className="text-title-sm font-semibold z-10 bg-white">
            {currentStep?.label}
          </div>
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
              course={course}
            />
          )}

          {currentStep.type === StepType.Payment && (
            <CoursePayment
              moveToNextStep={() => moveToNextStep()}
              moveToPrevStep={() => moveToPrevStep()}
              course={course}
              setCourse={setCourse}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseEdit;
