"use client";

import HorizontalScrollContainer from "@/components/_commons/HorizontalScrollContainer";
import { DEFAULT_PAGESIZE, FIRST_PAGE, PARAMS, ROUTES } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { SectionProgress } from "@/models/course/section-progress.model";
import { PageInfo, SortOrder } from "@/models/utils.model";
import { sectionProgressService } from "@/services/courses/section-progress.service";
import queryString from "query-string";
import React, { useEffect, useRef, useState } from "react";
import { ProgressSection } from "../../../../components/CourseItem/Section";

export const SectionProgressList: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [items, setItems] = useState<SectionProgress[]>();
  const router = useI18nRouter();
  const pageInfoRef = useRef<PageInfo>(); // Use useRef to store pageInfo

  const fetchSectionProgress = async (page?: number) => {
    try {
      setLoading(true);
      const { content, ...rest } = await sectionProgressService.getByUser({
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

  const onView = (item: SectionProgress) => {
    router.push(
      `${ROUTES.COURSE_DETAIL(
        item.section.course?.slug
      )}?${queryString.stringify({
        [PARAMS.COURSE_DETAIL.SECTION_ID]: item.section.id,
      })}`
    );
  };

  const loadMore = () => {
    if (!loading && pageInfoRef.current && !pageInfoRef.current.last) {
      fetchSectionProgress(pageInfoRef.current.page + 1);
    }
  };

  return (
    <>
      <HorizontalScrollContainer
        scrollOffset={"100%"}
        onLoadMore={loadMore}
        loadMoreThreshold={60}
      >
        <div className="px-2 py-4 ">
          <div className="grid grid-flow-col gap-4 auto-cols-1 md:auto-cols-2 lg:auto-cols-3 xl:auto-cols-4">
            {items?.map((item) => (
              <ProgressSection
                key={item.id}
                item={item}
                onView={() => onView(item)}
              />
            ))}
          </div>
        </div>
      </HorizontalScrollContainer>
    </>
  );
};
