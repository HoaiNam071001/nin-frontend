import React, { useEffect, useState } from "react";
import { CourseItem } from ".";
import {
  Section,
  SectionContent,
  SectionType,
} from "@/models/course/section.model";
import { sectionService } from "@/services/courses/section.service";
import NEditor from "../_commons/NEditor";
import { SectionFiles } from "./SectionFiles";
import I18n from "../_commons/I18n";
import NEmpty from "../_commons/NEmpty";
import { SystemFileType } from "@/models/file.model";

export const SectionResource = ({ section }: { section: Section }) => {
  const [content, setContent] = useState<SectionContent>(null);

  const getContent = async () => {
    if (content || !section) {
      return;
    }
    const data: SectionContent = await sectionService.getContent(section?.id);
    if (data?.files) {
      data.files = data.files.filter(e=> !e.deleted && e.systemType !== SystemFileType.VIDEO_CONTENT);
    }
    setContent(data);
  };

  useEffect(() => {
    getContent();
  }, [section?.id]);

  return (
    <div className="space-y-4">
      {content && (
        <>
          <div className="text-[16px]">
            <div>
              <I18n className={"font-semibold"} i18key={"Name"} />:
              <span className="ml-2">{section?.name}</span>
            </div>
            <div>
              <I18n className={"font-semibold"} i18key={"Type"} />:
              <span className="ml-2">{section?.type}</span>
            </div>
          </div>
          <div className="overflow-auto h-[60vh]">
            {content.type === SectionType.Video && (
              <div className="flex">
                {content.video?.file && (
                  <video controls className="w-[80%] mx-auto">
                    <source src={content.video?.file?.url || ""} />
                    Your browser does not support the video tag.
                  </video>
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
              (content.type === SectionType.Post &&
                !content.post?.content)) && (
              <>
                <NEmpty description="No Data" />
              </>
            )}
            <div>
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};
