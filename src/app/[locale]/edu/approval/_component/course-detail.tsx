"use client";

import I18n from "@/components/_commons/I18n";
import NButton from "@/components/_commons/NButton";
import { CourseBasicInfo } from "@/components/CourseDetail/CourseBasicInfo";
import { SectionMenu } from "@/components/CourseItem/SectionMenu";
import { CourseStatus } from "@/constants";
import { Course, CourseStatusPayload } from "@/models";
import { useModal } from "@/providers/ModalProvider";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";

const CourseConfirmDetail = ({
  course,
  update,
}: {
  course: Course;
  update?: (course: Course) => void;
}) => {
  const { closeModal } = useModal();

  const onSubmit = async () => {
    try {
      const payload: CourseStatusPayload = {
        status: CourseStatus.READY,
      };
      const response: Course = await courseService.updateStatus(
        course.id,
        payload
      );

      update?.(response);
      closeModal();
    } catch (error) {
      toastService.error(error?.message);
    }
  };
  return (
    <div className="flex flex-col rounded-sm gap-3 h-[70vh] overflow-auto relative">
      <CourseBasicInfo course={course} />
      {course && <SectionMenu courseId={course.id} viewContent={true} />}

      {course.status === CourseStatus.PENDING && (
        <div className="flex items-center sticky bottom-0 pt-3 bg-white">
          <NButton size="lg" onClick={onSubmit} className="ml-auto">
            <I18n i18key={"Accept"} />
          </NButton>
        </div>
      )}
    </div>
  );
};

export default CourseConfirmDetail;
