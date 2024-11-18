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
      <div className="text-[12px]">
        <I18n i18key="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. "></I18n>
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
