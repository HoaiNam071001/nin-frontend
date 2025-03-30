"use client";

import { SectionProgress } from "@/models/course/section-progress.model";
import { Section, SectionContent } from "@/models/course/section.model";
import { createContext, ReactNode, useState } from "react";
import DetailContainer from "./_components/DetailContainer";

interface PageProps {
  params: { slug: string };
}

export const CourseDetailContext = createContext<{
  section: Section;
  setSection: (c: Section) => void;
  setContent: (c: SectionContent) => void;
  content: SectionContent;
  setSProgress: (c: SectionProgress) => void;
  sProgress: SectionProgress;
} | null>(null);

const CourseDetailProvider = ({ children }: { children: ReactNode }) => {
  const [section, setSection] = useState(null);
  const [content, setContent] = useState<SectionContent>(null);
  const [sProgress, setSProgress] = useState<SectionProgress>(null);

  return (
    <CourseDetailContext.Provider
      value={{
        section,
        setSection,
        content,
        setContent,
        sProgress,
        setSProgress,
      }}
    >
      {children}
    </CourseDetailContext.Provider>
  );
};

const CourseDetailPage = ({ params }: PageProps) => {
  return (
    <CourseDetailProvider>
      <DetailContainer slug={params.slug} />
    </CourseDetailProvider>
  );
};

export default CourseDetailPage;
