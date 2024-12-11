import React, { useEffect, useState } from "react";
import { SectionCreator } from "./_components/SectionCreator";
import { SectionItem } from "./_components/SectionItem";
import { SettingSubmitProps } from "@/models";
import { Section } from "@/models/course/section.model";
import { sectionService } from "@/services/section.service";
import { toastService } from "@/services/toast.service";
import Loader from "../_commons/Loader";
import { CourseSubmit } from "./CourseSubmit";

export const CourseContent: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  moveToPrevStep,
  course,
}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCourse = async () => {
      try {
        setLoading(true);
        const sections: Section[] = await sectionService.getByCourse(course.id);
        setSections(sections);
        setLoading(false);
      } catch (error) {
        toastService.error(error?.message);
        setLoading(false);
      }
    };
    getCourse();
  }, [course?.id]);

  const onNext = () => {
    moveToNextStep?.();
  };

  const onPrev = () => {
    moveToPrevStep?.();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Loader />
      </div>
    );
  }
  const onAddSection = (section: Section, parent?: Section) => {
    if (parent) {
      if (parent.childrens) {
        parent.childrens.push(section);
      }
      else {
        parent.childrens = [section];
      }
      setSections([...sections]);
      return;
    }
    setSections([...sections, section]);
  };

  const onEditSection = (original: Section, section: Section) => {
    Object.assign(original, section);
    setSections([...sections]);
  };

  const onDeleteSection = (sectionId: number, parent: Section) => {
    if (parent) {
      parent.childrens = parent.childrens?.filter((e) => e.id !== sectionId);
      setSections([...sections]);
      return;
    }
    setSections([...sections.filter((e) => e.id !== sectionId)]);
  };

  return (
    <>
      <div className="overflow-auto">
        {sections?.map((e, index) => (
          <div key={index} className="mb-4">
            <SectionItem
              course={course}
              item={e}
              indexes={[index + 1]}
              onAddSection={onAddSection}
              onEditSection={onEditSection}
              onDeleteSection={onDeleteSection}
            ></SectionItem>
          </div>
        ))}
        <div className="mt-4">
          <SectionCreator course={course} onCreate={onAddSection} />
        </div>
      </div>

      <CourseSubmit
        moveToNextStep={onNext}
        moveToPrevStep={onPrev}
        cancel={moveToNextStep}
      ></CourseSubmit>
    </>
  );
};