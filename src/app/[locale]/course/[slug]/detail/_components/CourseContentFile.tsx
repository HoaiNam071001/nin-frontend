"use client";

import { CourseTargetType, FullCourse } from "@/models";
import React, { useContext, useEffect, useState } from "react";
import CourseTargetList from "../../../../../../components/CourseDetail/CourseTargetList";
import NEditor from "@/components/_commons/NEditor";
import I18n from "@/components/_commons/I18n";
import { CourseDetailContext } from "../page";
import { SectionFiles } from "@/components/CourseItem/SectionFiles";
import NEmpty from "@/components/_commons/NEmpty";

// Component cho tab Tổng quan
const CourseContentFile = ({ course }: { course: FullCourse }) => {
  const { content, section } = useContext(CourseDetailContext);

  return (
    <div>
      {content.files?.length > 0 && (
        <SectionFiles
          sectionId={section?.id}
          files={content.files}
          download={true}
        ></SectionFiles>
      )}
      {!content.files?.length && <NEmpty description="Empty file" />}
    </div>
  );
};

export default CourseContentFile;
