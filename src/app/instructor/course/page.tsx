"use client";

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CourseStepItem, CourseSteps, StepType } from "@/models";
import CourseSetting from "@/components/CourseSetting";
import { CourseTarget } from "@/components/CourseSetting/CourseTarget";
import { findIndex } from "lodash";
import { CourseOverview } from "@/components/CourseSetting/CourseOverview";
import { CourseContent } from "@/components/CourseSetting/CourseContent";
import { CoursePermisison } from "@/components/CourseSetting/CoursePermission";

const Course: React.FC = () => {
  const [currentStep, setStep] = useState<CourseStepItem>(CourseSteps[0]);

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

  return (
    <DefaultLayout>
      <div className="m-3 h-[80vh] bg-gray-1 rounded-md grid grid-cols-1 md:grid-cols-10 gap-4 px-4 py-3">
        <div className="md:col-span-2 h-full">
          <CourseSetting
            currentStep={currentStep.type}
            setStep={onChangeStep}
          ></CourseSetting>
        </div>
        <div className="md:col-span-8 bg-white h-full max-h-full p-4 rounded-lg flex flex-col">
          <div className="text-title-sm font-semibold mb-4">
            {currentStep?.label}
          </div>
          {currentStep.type === StepType.Target && (
            <CourseTarget moveToNextStep={() => moveToNextStep()} />
          )}

          {currentStep.type === StepType.OverView && (
            <CourseOverview
              moveToNextStep={() => moveToNextStep()}
              moveToPrevStep={() => moveToPrevStep()}
            />
          )}
          {currentStep.type === StepType.Content && (
            <CourseContent
              moveToNextStep={() => moveToNextStep()}
              moveToPrevStep={() => moveToPrevStep()}
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
    </DefaultLayout>
  );
};

export default Course;
