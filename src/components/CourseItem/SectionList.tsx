import React from "react";
import { ProgressSection } from "./Section";

export const SectionList: React.FC = () => {
  return (
    <>
      <div className="overflow-auto">
        <div className="grid grid-flow-col gap-4 auto-cols-1 md:auto-cols-2 lg:auto-cols-3 xl:auto-cols-4">
          {Array.from({ length: 10 }, (_, index) => index + 1).map((course) => (
            <ProgressSection key={course} />
          ))}
        </div>
      </div>
    </>
  );
};
