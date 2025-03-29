import I18n from "@/components/_commons/I18n";
import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import StatusBadge from "@/components/CourseItem/StatusBadge";
import { CourseStatus } from "@/constants";
import {
  Course,
  CourseStatusPayload,
  CourseStepItem,
  CourseSteps,
  StepType,
} from "@/models";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";

const statuses = {
  [CourseStatus.READY]: CourseStatus.PRIVATE,
  [CourseStatus.PRIVATE]: CourseStatus.READY,
  [CourseStatus.REJECT]: CourseStatus.PENDING,
  [CourseStatus.DRAFT]: CourseStatus.PENDING,
  [CourseStatus.PENDING]: CourseStatus.DRAFT,
};
const CourseSetting = ({
  currentStep,
  course,
  setStep,
  setCourse,
}: {
  currentStep: StepType;
  course: Course;
  setStep: (step: CourseStepItem) => void;
  setCourse: (course: Course) => void;
}) => {
  const onSubmit = async (status: CourseStatus) => {
    try {
      const payload: CourseStatusPayload = {
        status,
      };
      const response: Course = await courseService.updateStatus(
        course.id,
        payload
      );
      toastService.success("Updated successfully");
      setCourse?.(response);
    } catch (error) {
      toastService.error(error?.message);
    }
  };

  return (
    <div className="gap-2 grid">
      <div className="text-title-md font-semibold">
        <I18n i18key="Edit Course"></I18n>
      </div>
      <div className="flex flex-col gap-4">
        <StatusBadge status={course.status} />
        <div>
          {course?.status === CourseStatus.DRAFT && (
            <NButton onClick={() => onSubmit(CourseStatus.PENDING)}>
              <I18n i18key={"Publish"} />
            </NButton>
          )}
          {course?.status === CourseStatus.REJECT && (
            <NButton onClick={() => onSubmit(CourseStatus.PENDING)}>
              <I18n i18key={"Publish"} />
            </NButton>
          )}
          {course?.status === CourseStatus.READY && (
            <NButton onClick={() => onSubmit(CourseStatus.PRIVATE)}>
              <I18n i18key={"Close"} />
            </NButton>
          )}
          {course?.status === CourseStatus.PENDING && (
            <NButton onClick={() => onSubmit(CourseStatus.DRAFT)}>
              <I18n i18key={"Cancel"} />
            </NButton>
          )}
          {course?.status === CourseStatus.DELETED && (
            <NButton onClick={() => onSubmit(CourseStatus.DRAFT)}>
              <I18n i18key={"Restore"} />
            </NButton>
          )}
          {course?.status === CourseStatus.PRIVATE && (
            <NButton onClick={() => onSubmit(CourseStatus.READY)}>
              <I18n i18key={"Republished"} />
            </NButton>
          )}
        </div>
      </div>
      <div className="text-[14px] mb-3 space-y-2">
        <div>
          <I18n i18key="The course creation function helps you build and organize entire course content from start to finish."></I18n>
        </div>
      </div>

      <div className="text-title-sm font-semibold">
        <I18n i18key="Step:"></I18n>
      </div>

      <div>
        {CourseSteps.map((step, index) => (
          <div
            key={index}
            onClick={() => setStep(step)}
            className={`py-1 cursor-pointer`}
          >
            <div
              className={`px-3 py-2 rounded-lg flex items-center ${
                step.type === currentStep
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
