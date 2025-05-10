import Loader from "@/components/_commons/Loader";
import { SettingSubmitProps } from "@/models";
import { Section } from "@/models/course/section.model";
import { sectionService } from "@/services/courses/section.service";
import { toastService } from "@/services/toast.service";
import React, { useEffect, useState } from "react";
import { SectionCreator } from "./SectionCreator";
import { SectionItem } from "./SectionItem";

export const CourseContent: React.FC<SettingSubmitProps> = ({
  moveToNextStep,
  course,
  editable,
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
      } else {
        parent.childrens = [section];
      }
      setSections([...sections]);
      return;
    }
    setSections([...sections, section]);
  };

  const onEditSection = (original: Section, section: Section) => {
    Object.assign(original, section);
    sections.forEach((e) => {
      e.estimatedTime = e.childrens?.reduce(
        (total, child) => total + (child.estimatedTime || 0),
        0
      );
    });
    setSections([...sections]);
  };

  const onDeleteSection = (sectionId: number, parent: Section) => {
    if (parent) {
      parent.childrens = parent.childrens?.filter((e) => e.id !== sectionId);
      parent.estimatedTime = parent.childrens?.reduce(
        (total, child) => total + (child.estimatedTime || 0),
        0
      );
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
              disabled={!editable}
            ></SectionItem>
          </div>
        ))}
        {editable && (
          <div className="mt-4">
            <SectionCreator course={course} onCreate={onAddSection} />
          </div>
        )}
      </div>
    </>
  );
};
