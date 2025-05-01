"use client";

import HorizontalScrollContainer from "@/components/_commons/HorizontalScrollContainer";
import I18n from "@/components/_commons/I18n";
import { ItemList } from "@/components/CourseItem/ItemList";
import { Course } from "@/models";
import { courseSearchService } from "@/services/courses/course-search.service";
import React, { useEffect, useState } from "react";

export const TopRating: React.FC = () => {
  const [items, setItems] = useState<Course[]>();

  const fetchSectionProgress = async () => {
    try {
      const data = await courseSearchService.getTopRatings();
      setItems(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchSectionProgress();
  }, []);

  if (!items?.length) {
    return;
  }

  return (
    <>
      <div className="mb-4">
        <div className="text-title-sm font-semibold">
          <I18n i18key={"Recommended to you based on ratings"}></I18n>
        </div>
        <HorizontalScrollContainer scrollOffset={"100%"} loadMoreThreshold={60}>
          <div className="px-2 py-4">
            <ItemList courses={items} viewDetail={true}></ItemList>
          </div>
        </HorizontalScrollContainer>
      </div>
    </>
  );
};
