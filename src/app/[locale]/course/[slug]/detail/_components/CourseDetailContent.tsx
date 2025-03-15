"use client";

import { useContext, useEffect, useState } from "react";
import { sectionService } from "@/services/courses/section.service";
import {
  Section,
  SectionContent,
  SectionType,
} from "@/models/course/section.model";
import { SystemFileType } from "@/models/file.model";
import NEditor from "@/components/_commons/NEditor";
import NEmpty from "@/components/_commons/NEmpty";
import { CourseDetailContext } from "../page";
import VideoControl from "@/components/_commons/VideoControl";

export const CourseDetailContent = ({ courseId }: { courseId?: number }) => {
  const { section, content, setContent } = useContext(CourseDetailContext);
  const [loading, setLoading] = useState(false);

  const getContent = async () => {
    const data: SectionContent = await sectionService.getContent(section?.id);
    if (data?.files) {
      data.files = data.files.filter(
        (e) => !e.deleted && e.systemType !== SystemFileType.VIDEO_CONTENT
      );
    }
    setContent(data);
  };

  useEffect(() => {
    if (section) {
      getContent();
    }
  }, [section]);

  if (loading) {
    return <div>Loading sections...</div>; // Or a more sophisticated loading indicator
  }
  if (!content) {
    return <div className="h-[50px] flex items-center justify-center">No Content</div>; // Or a more sophisticated loading indicator
  }

  return (
    <div className="rounded-md space-y-4">
      <div className="max-h-[70vh] overflow-auto border border-stroke shadow-md rounded-md">
        {content.type === SectionType.Video && (
          <div >
            {content.video?.file && (
              <VideoControl videoSrc={content.video?.file?.url} />
            )}
          </div>
        )}
        {content.type === SectionType.Post && (
          <div>
            {content.post?.content && (
              <NEditor value={content.post?.content} readOnly={true} />
            )}
          </div>
        )}
        {((content.type === SectionType.Video && !content.video?.file) ||
          (content.type === SectionType.Post && !content.post?.content)) && (
          <>
            <NEmpty description="No Data" />
          </>
        )}
        
        {/* <div>
              <div className="text-title-sm">
                <I18n i18key={"Files"} />:
              </div>
              {content.files?.length > 0 && (
                <SectionFiles
                  sectionId={section?.id}
                  files={content.files}
                ></SectionFiles>
              )}
              {!content.files?.length && <NEmpty description="Empty file" />}
            </div> */}
      </div>
    </div>
  );
};
