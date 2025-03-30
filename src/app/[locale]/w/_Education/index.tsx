"use client";

import React from "react";

import { SectionProgressList } from "@/app/[locale]/w/_Education/SectionProgressList";
import I18n from "@/components/_commons/I18n";
import { TopCourses } from "./TopCourses";

const Education: React.FC = () => {
  const tabs = [
    {
      id: 1,
      label: "Web development",
    },
    {
      id: 2,
      label: "Communication",
    },
  ];
  return (
    <>
      <div className=" container mx-auto">
        <div className="mb-4">
          <div className="text-title-sm font-semibold">
            <I18n i18key={" Pick up where you left off"}></I18n>
          </div>
          <SectionProgressList></SectionProgressList>
        </div>

        <div className="mb-4">
          <TopCourses title={"What to learn next"}>
            {/* <CategoryTab tabs={tabs}></CategoryTab> */}
          </TopCourses>
        </div>

        <div className="mb-4">
          <TopCourses
            title={"Recommended to you based on ratings"}
          ></TopCourses>
        </div>
        <div className="mb-4">
          <TopCourses title={"New on NIN Education"}></TopCourses>
        </div>
      </div>
    </>
  );
};

export default Education;
