import { CourseStepItem, CourseSteps, StepType } from "@/models";
import I18n from "../_commons/I18n";
import SvgIcon from "../_commons/SvgIcon";

const CourseSetting = (props: {
  currentStep: StepType,
  setStep: (step: CourseStepItem) => void,
}) => {
  return (
    <div className="gap-2 grid">
      <div className="text-title-md font-semibold">
        <I18n i18key="Create Course"></I18n>
      </div>
      <div className="text-[14px] mb-3 space-y-2">
        <div>
        <I18n i18key="The course creation function helps you build and organize entire course content from start to finish."></I18n>
        </div>
        <I18n i18key="The purpose of this feature is to help you easily create a clearly structured course that provides complete and accessible information for students."></I18n>
      </div>

      <div className="text-title-sm font-semibold">
        <I18n i18key="Step:"></I18n>
      </div>

      <div>
        {CourseSteps.map((step, index) => (
          <div
            key={index}
            onClick={() => props.setStep(step)}
            className={`py-1 cursor-pointer`}
          >
            <div
              className={`px-3 py-2 rounded-lg flex items-center ${
                step.type === props.currentStep
                  ? "text-system bg-gray-4"
                  : "text-gray-400 bg-transparent"
              }`}
            >
              <SvgIcon icon="search" className="icon icon-sm" />
              <span className="ml-2">{step.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSetting;
