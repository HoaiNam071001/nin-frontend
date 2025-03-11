"use client";

import { useEffect, useState } from "react";
import SvgIcon from "../_commons/SvgIcon";
import { sectionService } from "@/services/courses/section.service";
import { Section, SectionType } from "@/models/course/section.model";
import { toastService } from "@/services/toast.service";
import { useModal } from "@/providers/ModalProvider";
import { SectionResource } from "./SectionResourse";
import I18n from "../_commons/I18n";

export const SectionMenu = ({
  courseId,
  viewContent = false,
}: {
  courseId: number;
  viewContent?: boolean;
}) => {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const getCourse = async () => {
      try {
        const sections: Section[] = await sectionService.getByCourse(courseId);
        setSections(sections);
      } catch (error) {
        toastService.error(error?.message);
      }
    };
    if (!courseId) {
      return;
    }
    getCourse();
  }, [courseId]);

  return (
    <div className="space-y-2 border border-stroke rounded-md">
      {sections?.map((e, index) => (
        <SectionTree key={index} item={e} viewContent={viewContent} />
      ))}
    </div>
  );
};

const SectionTree = ({
  item,
  viewContent,
}: {
  item: Section;
  viewContent: boolean;
}) => {
  const [isExpand, setExpand] = useState(false);
  const { openModal } = useModal();

  const onToggle = () => {
    setExpand(!isExpand);
  };

  const onViewContent = (item: Section) => {
    if (!viewContent) {
      return;
    }
    openModal({
      content: (
        <>
          <SectionResource section={item} />
        </>
      ),
      header: (
        <>
          <div><I18n i18key={'View Content'}/></div>
        </>
      ),
      onClose: () => {
      },
      config: {
        width: "800px",
      },
    });
  };

  return (
    <div className="">
      <div
        onClick={onToggle}
        className="flex items-center flex-nowrap bg-slate-100 p-3 rounded-sm cursor-pointer"
      >
        <SvgIcon
          icon="arrow"
          className={`icon icon-sm transition-[0.5s] ${
            isExpand ? "rotate-180" : "rotate-90"
          }`}
        ></SvgIcon>

        <span className="font-semibold line-clamp-2 mr-4 ml-2 capitalize">
          {item.name}
        </span>
        <span className="ml-auto whitespace-nowrap">30 minutes</span>
      </div>

      {isExpand &&
        item.childrens?.map((e, index) => (
          <div
            key={index}
            onClick={() => onViewContent(e)}
            className="flex items-center gap-4 pl-4 pr-3 py-2 rounded bg-white hover:bg-slate-50 cursor-pointer"
          >
            {e.type === SectionType.Post && <SvgIcon icon="file" className="icon icon-md"></SvgIcon>}
            {e.type === SectionType.Video && <SvgIcon icon="video-file" className="icon icon-md"></SvgIcon>}

            <span className="capitalize">{e.name}</span>
            <span className="ml-auto">30:10</span>
          </div>
        ))}
    </div>
  );
};
