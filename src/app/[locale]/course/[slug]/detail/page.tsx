"use client"

import { createContext, ReactNode, useState } from "react";
import DetailContainer from "./_components/DetailContainer";
import { Section, SectionContent } from "@/models/course/section.model";

interface PageProps {
  params: { slug: string };
}

export const CourseDetailContext = createContext<{
  section: Section;
  setSection: (c: Section) => void;
  setContent: (c: SectionContent) => void;
  content: SectionContent | null;
} | null>(null);

const CourseDetailProvider = ({ children }: { children: ReactNode }) => {
  const [section, setSection] = useState(null);
  const [content, setContent] = useState<SectionContent>(null);

  return (
    <CourseDetailContext.Provider value={{ section, setSection, content, setContent }}>
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
