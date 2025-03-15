"use client";

import { useContext, useEffect, useState } from "react";
import { sectionService } from "@/services/courses/section.service";
import { Section, SectionType } from "@/models/course/section.model";
import { toastService } from "@/services/toast.service";
import { useModal } from "@/providers/ModalProvider";
import { SectionResource } from "@/components/CourseItem/SectionResourse";
import I18n from "@/components/_commons/I18n";
import SvgIcon from "@/components/_commons/SvgIcon";
import HMSDisplay, { HMSDisplayMode } from "@/components/_commons/HMSDisplay";
import { CourseDetailContext } from "../page";
import { head } from "lodash";
import NEmpty from "@/components/_commons/NEmpty";

interface SectionMenuProps {
  courseId: number;
}

export const CourseSectionMenu = ({ courseId }: SectionMenuProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSection, section: selected } = useContext(CourseDetailContext);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    const fetchSections = async () => {
      try {
        const fetchedSections = await sectionService.getByCourse(courseId);
        setSections(fetchedSections);
      } catch (error: any) {
        toastService.error(error?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [courseId]);

  const getCurrentSection = () => {
    setSection(head(sections).childrens[0]);
  };

  useEffect(() => {
    if (sections?.length) {
      getCurrentSection();
    }
  }, [sections]);

  const selectChildSection = (section: Section, child: Section) => {
    setSection(child);
  };

  if (loading) {
    return <div>Loading sections...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <div className="space-y-2 border border-stroke rounded-md">
      {sections?.map((section, index) => (
        <SectionTree
          selected={selected}
          key={index}
          item={section}
          selectSection={(child) => selectChildSection(section, child)}
        />
      ))}
      {!sections?.length && (
        <div className="py-10">
          <NEmpty />
        </div>
      )}
    </div>
  );
};

interface SectionTreeProps {
  item: Section;
  selected: Section;
  selectSection: (section: Section) => void;
}

const SectionTree = ({ item, selected, selectSection }: SectionTreeProps) => {
  const [isExpand, setExpand] = useState(true);

  const handleToggle = () => {
    setExpand(!isExpand);
  };

  return (
    <div>
      <div
        onClick={handleToggle}
        className="flex items-center flex-nowrap bg-slate-100 p-3 rounded-sm cursor-pointer"
      >
        <SvgIcon
          icon="arrow"
          className={`icon icon-sm transition-[0.5s] ${
            isExpand ? "rotate-180" : "rotate-90"
          }`}
        />
        <span className="font-semibold line-clamp-2 mr-4 ml-2 capitalize">
          {item.name}
        </span>
        <span className="ml-auto whitespace-nowrap">
          <HMSDisplay
            seconds={item.estimatedTime}
            mode={HMSDisplayMode.short}
          />
        </span>
      </div>

      {isExpand &&
        item.childrens?.map((child, index) => (
          <div
            key={index}
            onClick={() => selectSection(child)}
            className={`flex items-center gap-4 pl-4 pr-3 py-2 rounded cursor-pointer ${
              selected?.id === child.id
                ? "bg-system bg-opacity-10"
                : "hover:bg-slate-50"
            }`}
          >
            {child.type === SectionType.Post && (
              <SvgIcon icon="file" className="icon icon-md" />
            )}
            {child.type === SectionType.Video && (
              <SvgIcon icon="video-file" className="icon icon-md" />
            )}
            <span className="capitalize">{child.name}</span>
            <span className="ml-auto">
              <HMSDisplay
                seconds={child.estimatedTime}
                mode={HMSDisplayMode.short}
              />
            </span>
          </div>
        ))}
    </div>
  );
};
