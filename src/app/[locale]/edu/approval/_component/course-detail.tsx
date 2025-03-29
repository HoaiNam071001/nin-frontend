"use client";

import I18n from "@/components/_commons/I18n";
import NButton from "@/components/_commons/NButton";
import NEditor from "@/components/_commons/NEditor";
import { CourseBasicInfo } from "@/components/CourseDetail/CourseBasicInfo";
import { SectionMenu } from "@/components/CourseItem/SectionMenu";
import { CourseStatus } from "@/constants";
import { Course, CourseStatusPayload, FullCourse } from "@/models";
import { useModal } from "@/providers/ModalProvider";
import { courseSearchService } from "@/services/courses/course-search.service";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";
import { useEffect, useState } from "react";

const CourseConfirmDetail = ({
  course,
  update,
}: {
  course: Course;
  update?: (course: Course) => void;
}) => {
  const [note, setNote] = useState<string>("");

  const { closeModal } = useModal();
  const [fullCourse, setFullCourse] = useState<FullCourse>(null);
  const getBySlug = async () => {
    try {
      const response: FullCourse = await courseSearchService.getBySlug(
        course.slug
      );
      setFullCourse(response);
    } catch (error) {
      toastService.error(error?.message);
    }
  };
  useEffect(() => {
    getBySlug();
  }, [course]);

  const onSubmit = async (status: CourseStatus) => {
    try {
      const payload: CourseStatusPayload = {
        status: status,
        content: note,
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
      {fullCourse && <CourseBasicInfo course={fullCourse} />}
      {fullCourse && <SectionMenu courseId={course.id} viewContent={true} />}

      {course.status === CourseStatus.PENDING && (
        <div className="">
          <div className="text-title-xl font-semibold">
            <I18n i18key={"Confirm approval"}/>
          </div>
          <NEditor value={note} onChange={(value) => setNote(value)} />

          <div className="flex items-center gap-4 sticky bottom-0 pt-3 bg-white">
            <NButton
              size="lg"
              color="red"
              variant="filled"
              onClick={() => onSubmit(CourseStatus.REJECT)}
              className="ml-auto"
            >
              <I18n i18key={"Reject"} />
            </NButton>
            <NButton size="lg" onClick={() => onSubmit(CourseStatus.READY)}>
              <I18n i18key={"Accept"} />
            </NButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseConfirmDetail;
