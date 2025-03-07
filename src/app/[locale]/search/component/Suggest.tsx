"use client";

import I18n from "@/components/_commons/I18n";
import { ItemList } from "@/components/CourseItem/ItemList";
import { Course } from "@/models";
import { RootState } from "@/redux";
import { courseSearchService } from "@/services/courses/course-search.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SearchSuggest: React.FC = () => {
  const [rows, setRows] = useState<Course[]>([]);
  const keyword = useSelector((state: RootState) => state.utils.keyword);

  const fetchCourses = async () => {
    try {
      const courses: Course[] = await courseSearchService.getSuggest({
        keyword,
        size: 10
      });
      setRows(courses);
    } catch (error) {
      setRows([]);
    }
  };
  useEffect(() => {
    fetchCourses();

  }, [keyword]);
  return (
    <div className="flex flex-col gap-4">
      <div className="font-semibold text-title-sm">
        <I18n i18key={"Suggestion"} />
      </div>
      <ItemList courses={rows}></ItemList>
    </div>
  );
};

export default SearchSuggest;
