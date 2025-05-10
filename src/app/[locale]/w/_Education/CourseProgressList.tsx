"use client";

import HorizontalScrollContainer from "@/components/_commons/HorizontalScrollContainer";
import I18n from "@/components/_commons/I18n";
import { CourseProgressItem } from "@/components/CourseItem/CourseProgress";
import { DEFAULT_PAGESIZE, FIRST_PAGE, ROUTES } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { CourseProgress } from "@/models";
import { PageInfo, SortOrder } from "@/models/utils.model";
import { courseProgressService } from "@/services/courses/course-progress.service";
import React, { useEffect, useRef, useState } from "react";

export const CourseProgressList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [items, setItems] = useState<CourseProgress[]>();
  const router = useI18nRouter();
  const pageInfoRef = useRef<PageInfo>(); // Use useRef to store pageInfo

  const fetchSectionProgress = async (page?: number) => {
    try {
      setLoading(true);
      const { content, ...rest } = await courseProgressService.get({
        page: page || FIRST_PAGE,
        size: DEFAULT_PAGESIZE,
        sort: [
          {
            property: "updatedAt",
            direction: SortOrder.DESC,
          },
        ],
      });
      setPageInfo(rest);
      pageInfoRef.current = rest;
      setLoading(false);

      if (rest.first) {
        setItems(content);
        return;
      }
      setItems((items) => [...items, ...content]);
    } catch (error: any) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionProgress();
  }, []);

  const onView = (item: CourseProgress) => {
    router.push(`${ROUTES.COURSE_DETAIL(item.course?.slug)}`);
  };

  const loadMore = () => {
    if (!loading && pageInfoRef.current && !pageInfoRef.current.last) {
      fetchSectionProgress(pageInfoRef.current.page + 1);
    }
  };

  if (loading || !items?.length) {
    return;
  }

  return (
    <>
      <div>
        <div className="text-title-sm font-semibold">
          <I18n i18key={"Your courses in progress"}></I18n>
        </div>
        <HorizontalScrollContainer
          scrollOffset={"100%"}
          onLoadMore={loadMore}
          loadMoreThreshold={60}
        >
          <div className="px-2 py-4">
            <div className="grid grid-flow-col gap-4 auto-cols-1 md:auto-cols-3 lg:auto-cols-4 xl:auto-cols-5">
              {items?.map((item) => (
                <CourseProgressItem
                  key={item.id}
                  item={item}
                  onView={() => onView(item)}
                />
              ))}
            </div>
          </div>
        </HorizontalScrollContainer>
      </div>
    </>
  );
};
