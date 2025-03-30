"use client";

import HMSDisplay, { HMSDisplayMode } from "@/components/_commons/HMSDisplay";
import NButton from "@/components/_commons/NButton";
import NEmpty from "@/components/_commons/NEmpty";
import SvgIcon from "@/components/_commons/SvgIcon";
import { PARAMS } from "@/constants";
import {
  SectionProgress,
  UpdateSectionProgressPayload,
} from "@/models/course/section-progress.model"; // Import SectionProgress model
import { Section, SectionType } from "@/models/course/section.model";
import { sectionProgressService } from "@/services/courses/section-progress.service";
import { sectionService } from "@/services/courses/section.service";
import { toastService } from "@/services/toast.service";
import { head } from "lodash";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useEffect, useState } from "react";
import { CourseDetailContext } from "../page";

interface SectionMenuProps {
  courseId: number;
}

export const CourseSectionMenu = ({ courseId }: SectionMenuProps) => {
  const searchParams = useSearchParams().toString();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    setSection,
    sProgress,
    section: selected,
  } = useContext(CourseDetailContext);
  const [progressMap, setProgressMap] = useState<
    Record<number, SectionProgress>
  >({});

  const fetchSections = async () => {
    try {
      return await sectionService.getByCourse(courseId);
    } catch (error) {
      toastService.error(error?.message);
      return [];
    }
  };

  const updateProgress = async (
    sectionId: number,
    payload: UpdateSectionProgressPayload
  ) => {
    try {
      const progress = await sectionProgressService.update(sectionId, payload);
      setProgressMap((prev) => ({
        ...(prev || {}),
        [sectionId]: progress,
      }));
    } catch (error) {
      toastService.error(error.message);
    }
  };

  const fetchSectionProgress = async () => {
    try {
      const progresses = await sectionProgressService.getByCourse(courseId);
      const progressRecord: Record<number, SectionProgress> = {};
      progresses.forEach((progress) => {
        progressRecord[progress.section.id] = progress;
      });
      return progressRecord;
    } catch (error: any) {
      toastService.error(error?.message);
      return {};
    }
  };

  useEffect(() => {
    if (!sProgress) {
      return;
    }
    setProgressMap((prev) => ({
      ...(prev || {}),
      [sProgress.section.id]: sProgress,
    }));
  }, [sProgress]);

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const [fetchedSections, fetchedProgress] = await Promise.all([
        fetchSections(),
        fetchSectionProgress(),
      ]);

      setSections(fetchedSections);
      setProgressMap(fetchedProgress);

      setLoading(false);
    };

    fetchData();
  }, [courseId]);

  const getCurrentSection = () => {
    const selectedSectionId = queryString.parse(searchParams.toString())?.[
      PARAMS.COURSE_DETAIL.SECTION_ID
    ];

    if (!selectedSectionId) {
      setSection(head(sections)?.childrens?.[0]);
      return;
    }

    const numericSectionId = +selectedSectionId;

    const foundSection = sections.reduce((accumulator, currentSection) => {
      if (accumulator) return accumulator;

      if (currentSection.id === numericSectionId) {
        return currentSection.childrens?.[0];
      }

      return currentSection.childrens?.find(
        (child) => child.id === numericSectionId
      );
    }, null);

    if (foundSection) {
      setSection(foundSection);
    }
  };

  useEffect(() => {
    if (sections?.length) {
      getCurrentSection();
    }
  }, [sections, searchParams]);

  const selectChildSection = (section: Section, child: Section) => {
    setSection(child);
  };

  if (loading) {
    return <div>Loading sections...</div>;
  }

  return (
    <div className="space-y-2 border border-stroke rounded-md">
      {sections?.map((section, index) => (
        <SectionTree
          selected={selected}
          key={index}
          index={index}
          updateProgress={updateProgress}
          item={section}
          selectSection={(child) => selectChildSection(section, child)}
          progressMap={progressMap}
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
  index: number;
  updateProgress: (
    sectionId: number,
    payload: UpdateSectionProgressPayload
  ) => void;
  selectSection: (section: Section) => void;
  progressMap: Record<number, SectionProgress>;
}

const SectionTree = ({
  item,
  selected,
  selectSection,
  index,
  progressMap,
  updateProgress,
}: SectionTreeProps) => {
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
        <span className="font-semibold line-clamp-2 mr-4 ml-2 ">
          {index + 1}. {item.name}
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
            className={`flex items-center gap-2 pl-4 pr-3 py-2 cursor-pointer ${
              selected?.id === child.id
                ? "bg-system bg-opacity-10"
                : "hover:bg-slate-50"
            }`}
          >
            <div className="relative group">
              {!progressMap?.[child.id]?.completed && (
                <>
                  <SvgIcon icon="circle" className="icon icon-md" />
                </>
              )}
              {progressMap?.[child.id]?.completed && (
                <>
                  <SvgIcon icon="success" className="icon icon-md" />
                </>
              )}
              <div className="absolute top-0 left-0 z-10 invisible group-hover:visible flex bg-white rounded-full">
                <NButton
                  tooltip={
                    progressMap?.[child.id]?.completed
                      ? "reset it"
                      : "complete it"
                  }
                  className="!p-0"
                  shape="full"
                  size="md"
                  variant="link"
                  onClick={() =>
                    updateProgress(child.id, {
                      completed: !progressMap?.[child.id]?.completed,
                    })
                  }
                >
                  <SvgIcon
                    icon={
                      progressMap?.[child.id]?.completed ? "circle" : "success"
                    }
                    className="icon icon-md"
                  />
                </NButton>
              </div>
            </div>
            {child.type === SectionType.Post && (
              <SvgIcon icon="file" className="icon icon-md" />
            )}
            {child.type === SectionType.Video && (
              <SvgIcon icon="video-file" className="icon icon-md" />
            )}
            <span className=" line-clamp-2">{child.name}</span>
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
