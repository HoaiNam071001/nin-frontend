import I18n from "@/components/_commons/I18n";
import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import StatusBadge from "@/components/CourseItem/StatusBadge";
import { CourseStatus, ROUTES } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import {
  Course,
  CourseStatusPayload,
  CourseStepItem,
  CourseSteps,
  StepType,
} from "@/models";
import { useModal } from "@/providers/ModalProvider";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";

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
  const { openConfirm } = useModal();
  const router = useI18nRouter();

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

  const onDelete = async () => {
    try {
      openConfirm({
        header: "Delete Course",
        content:
          "Are you sure you want to delete this course? This action cannot be undone.",
        onOk: async () => {
          try {
            await courseService.delete(course.id);
            toastService.success("Course deleted successfully");
            router.push(ROUTES.INSTRUCTOR);
          } catch (error) {
            toastService.error(
              error?.message || "Failed to delete course. Please try again."
            );
          }
        },
      });
    } catch (error) {
      toastService.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-title-md font-semibold">
        <I18n i18key="Edit Course"></I18n>
      </div>
      <div className="flex flex-col gap-4 mt-3">
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
          {course?.status === CourseStatus.PENDING && (
            <NButton onClick={() => onSubmit(CourseStatus.DRAFT)}>
              <I18n i18key={"Cancel"} />
            </NButton>
          )}
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

      <div className="mt-auto">
        <NButton variant={"filled"} color={"red"} onClick={() => onDelete()}>
          <I18n i18key={"Delete"} />
        </NButton>
      </div>
    </div>
  );
};

export default CourseSetting;
