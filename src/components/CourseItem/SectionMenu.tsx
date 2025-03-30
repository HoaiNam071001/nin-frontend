"use client";

import { Section, SectionType } from "@/models/course/section.model";
import { useModal } from "@/providers/ModalProvider";
import { sectionService } from "@/services/courses/section.service";
import { toastService } from "@/services/toast.service";
import { useEffect, useState } from "react";
import HMSDisplay, { HMSDisplayMode } from "../_commons/HMSDisplay";
import I18n from "../_commons/I18n";
import SvgIcon from "../_commons/SvgIcon";
import { SectionResource } from "./SectionResourse";

interface SectionMenuProps {
  courseId: number;
  viewContent?: boolean;
}

export const SectionMenu = ({
  courseId,
  viewContent = false,
}: SectionMenuProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading sections...</div>; // Or a more sophisticated loading indicator
  }

  return (
    <div className="space-y-2 border border-stroke rounded-md">
      {sections?.map((section, index) => (
        <SectionTree key={index} item={section} viewContent={viewContent} />
      ))}
    </div>
  );
};

interface SectionTreeProps {
  item: Section;
  viewContent: boolean;
}

const SectionTree = ({ item, viewContent }: SectionTreeProps) => {
  const [isExpand, setExpand] = useState(false);
  const { openModal } = useModal();

  const handleToggle = () => {
    setExpand(!isExpand);
  };

  const handleViewContent = (section: Section) => {
    if (!viewContent) return;

    openModal({
      content: <SectionResource section={section} />,
      header: <I18n i18key={"View Content"} />,
      onClose: () => {},
      config: { width: "800px" },
    });
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
        <span className="font-semibold line-clamp-2 mr-4 ml-2 ">
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
            onClick={() => handleViewContent(child)}
            className="flex items-center gap-4 pl-4 pr-3 py-2 rounded bg-white hover:bg-slate-50 cursor-pointer"
          >
            {child.type === SectionType.Post && (
              <SvgIcon icon="file" className="icon icon-md" />
            )}
            {child.type === SectionType.Video && (
              <SvgIcon icon="video-file" className="icon icon-md" />
            )}
            <span className="">{child.name}</span>
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
