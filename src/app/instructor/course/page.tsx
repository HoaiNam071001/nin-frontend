"use client";

import React, { useState } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { CourseSteps, StepType } from "@/models";
import CourseSetting from "@/components/CourseSetting";
import { CourseTarget } from "@/components/CourseSetting/CourseTarget";
import { findIndex } from "lodash";
import { CourseOverview } from "@/components/CourseSetting/CourseOverview";
import { CourseContent } from "@/components/CourseSetting/CourseContent";

const Course: React.FC = () => {
  const [currentStep, setStep] = useState<StepType>(StepType.Target);

  const onChangeStep = (step: StepType) => {
    setStep(step);
  };

  const moveToNextStep = () => {
    const index = findIndex(CourseSteps, (e) => e.type === currentStep);
    if (CourseSteps[index + 1]) {
      onChangeStep(CourseSteps[index + 1].type);
    }
  };

  const moveToPrevStep = () => {
    const index = findIndex(CourseSteps, (e) => e.type === currentStep);
    if (CourseSteps[index - 1]) {
      onChangeStep(CourseSteps[index - 1].type);
    }
  };

  return (
    <DefaultLayout>
      <div className="m-3 max-h-[100vh] min-w-[] bg-gray-1 rounded-md grid grid-cols-1 md:grid-cols-10 gap-4 min-h-[80%] px-4 py-3">
        <div className="md:col-span-2 h-full">
          <CourseSetting
            currentStep={currentStep}
            setStep={onChangeStep}
          ></CourseSetting>
        </div>
        <div className="md:col-span-8 bg-white h-full">
          {currentStep === StepType.Target && (
            <CourseTarget
              moveToNextStep={() => moveToNextStep()}
            ></CourseTarget>
          )}

          {currentStep === StepType.OverView && (
            <CourseOverview
              moveToNextStep={() => moveToNextStep()}
              moveToPrevStep={() => moveToPrevStep()}
            ></CourseOverview>
          )}
          {currentStep === StepType.Content && (
            <CourseContent
              moveToNextStep={() => moveToNextStep()}
              moveToPrevStep={() => moveToPrevStep()}
            ></CourseContent>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Course;
