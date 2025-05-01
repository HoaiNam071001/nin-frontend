"use client";

import NEmpty from "@/components/_commons/NEmpty";
import VideoControl from "@/components/_commons/VideoControl";
import {
  SectionProgress,
  UpdateSectionProgressPayload,
} from "@/models/course/section-progress.model";
import { SectionContent, SectionType } from "@/models/course/section.model";
import { SystemFileType } from "@/models/file.model";
import { sectionProgressService } from "@/services/courses/section-progress.service";
import { sectionService } from "@/services/courses/section.service";
import { toastService } from "@/services/toast.service";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { CourseDetailContext } from "../page";
import PostContent from "./PostContent";
export const CourseDetailContent = ({ courseId }: { courseId?: number }) => {
  const { section, content, setContent, setSProgress, sProgress } =
    useContext(CourseDetailContext);
  const [loading, setLoading] = useState(false);

  const getContent = async () => {
    setLoading(true);
    const data: SectionContent = await sectionService.getContent(section?.id);
    if (data?.files) {
      data.files = data.files.filter(
        (e) => !e.deleted && e.systemType !== SystemFileType.VIDEO_CONTENT
      );
    }
    setContent(data);
    setLoading(false);
  };

  const updateProgress = async (payload: UpdateSectionProgressPayload) => {
    try {
      const progress = await sectionProgressService.update(section.id, payload);
      setSProgress(progress);
    } catch (error) {
      toastService.error(error.message);
    }
  };

  const fetchSectionProgress = async () => {
    try {
      let progress: SectionProgress = await sectionProgressService.getBySection(
        section.id
      );
      if (!progress) {
        progress = await sectionProgressService.create(section.id);
      }
      // setSProgress(progress);
      updateProgress({
        updatedAt: moment().toISOString(),
      });
    } catch (error: any) {
      toastService.error(error?.message);
    }
  };

  useEffect(() => {
    if (section) {
      getContent();
      fetchSectionProgress();
    }
  }, [section]);

  if (loading) {
    return <div>Loading sections...</div>;
  }

  if (!content) {
    return (
      <div className="h-[50px] flex items-center justify-center">
        No Content
      </div>
    );
  }

  return (
    <div className="rounded-md space-y-4">
      <div className="max-h-[70vh] overflow-auto border border-stroke shadow-md rounded-md">
        {content.type === SectionType.Video && (
          <div>
            {content.video?.file && (
              <VideoControl videoSrc={content.video?.file?.url} />
            )}
          </div>
        )}
        {content.type === SectionType.Post && (
          <PostContent
            content={content}
            section={section}
            progress={sProgress}
            updateProgress={updateProgress}
          />
        )}
        {((content.type === SectionType.Video && !content.video?.file) ||
          (content.type === SectionType.Post && !content.post?.content)) && (
          <>
            <NEmpty description="No Data" />
          </>
        )}
      </div>

      <div className="mt-3 text-title-sm text-slate-600 font-bold">
        {section.name}
      </div>
    </div>
  );
};
