"use client";

import SearchFilter from "./component/SearchFilter";
import SearchContent from "./component/SearchContent";
import { createContext } from "react";
import { CourseSearchPayload } from "@/models";
import { ReactNode, useState } from "react";
import { CourseStatus } from "@/constants";
import SearchSuggest from "./component/Suggest";
// import { useState } from "react";
export const SearchContext = createContext<{
  filter: CourseSearchPayload;
  setFilter: (c: CourseSearchPayload) => void;
} | null>(null);

const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<CourseSearchPayload>({
    status: [CourseStatus.READY],
  });

  return (
    <SearchContext.Provider value={{ filter, setFilter }}>
      {children}
    </SearchContext.Provider>
  );
};

const CourseBoard: React.FC = () => {
  // const [filter, setFilter] = useState();
  return (
    <SearchProvider>
      <div className="h-[calc(100vh-130px)] bg-gray-1 rounded-sm flex gap-4 p-4">
        <div className="min-w-[250px] h-full">
          <SearchFilter />
        </div>

        <div className="flex-1 bg-white h-full max-h-full rounded-sm overflow-hidden flex flex-col">
          <SearchContent />
        </div>
      </div>
      <div className="mt-4">
      <SearchSuggest></SearchSuggest>
      </div>
    </SearchProvider>
  );
};

export default CourseBoard;
