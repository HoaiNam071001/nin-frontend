"use client";

import CourseContainer from "@/components/_commons/ContainerGrid";
import I18n from "@/components/_commons/I18n";
import NEmpty from "@/components/_commons/NEmpty";
import NPagination from "@/components/_commons/NPagination";
import NSelection from "@/components/_commons/NSelection";
import { CourseItem } from "@/components/CourseItem";
import { DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { Course } from "@/models";
import {
  DropdownOption,
  List2Res,
  OrderBy,
  PageAble,
  PageInfo,
  SortOrder,
} from "@/models/utils.model";
import { RootState } from "@/redux";
import { courseSearchService } from "@/services/courses/course-search.service";
import { toastService } from "@/services/toast.service";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { SearchContext } from "../page";

const sortItems: DropdownOption<OrderBy>[] = [
  {
    name: "Newest First",
    value: {
      property: "updatedAt",
      direction: SortOrder.ASC,
    },
  },
  {
    name: "Oldest First",
    value: {
      property: "updatedAt",
      direction: SortOrder.DESC,
    },
  },
  {
    name: "A-Z",
    value: {
      property: "name",
      direction: SortOrder.ASC,
    },
  },
  {
    name: "Z-A",
    value: {
      property: "name",
      direction: SortOrder.DESC,
    },
  },
  {
    name: "Price Ascending",
    value: {
      property: "price",
      direction: SortOrder.ASC,
    },
  },
  {
    name: "Price Descending",
    value: {
      property: "price",
      direction: SortOrder.DESC,
    },
  },
];

const SearchContent: React.FC = () => {
  const pathname = usePathname();
  const context = useContext(SearchContext);
  const firstRender = useRef(true);
  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
  });
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [sorter, setSorter] = useState<DropdownOption<OrderBy>>(sortItems[0]);

  const [rows, setRows] = useState<Course[]>([]);
  const keyword = useSelector((state: RootState) => state.utils.keyword);
  const router = useI18nRouter();
  const fetchCourses = async () => {
    try {
      const { content, ...res }: List2Res<Course> =
        await courseSearchService.getCourses(context.filter, {
          ...pageAble,
          keyword,
        });
      setRows(content);
      setPageInfo(res);
    } catch (error) {
      toastService.info(error?.message);
      setRows([]);
      setPageInfo(null);
    }
  };
  useEffect(() => {}, [keyword]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false; // Đánh dấu đã render lần đầu tiên
      return; // Bỏ qua lần render đầu tiên
    }
    fetchCourses();
  }, [context.filter, pageAble, keyword]);

  const setPageAbleValue = (value: PageAble) => {
    setPageAble({
      ...pageAble,
      ...value,
    });
  };

  return (
    <div className="overflow-auto px-3 rounded-md relative flex-1">
      <div className="flex sticky top-0 z-10 bg-white pt-3 mb-3">
        <div className="font-semibold text-title-sm">
          <I18n i18key={"Search"} />
        </div>
        <NSelection
          value={sorter}
          bindLabel="name"
          className="ml-auto"
          onChange={(value: DropdownOption<OrderBy>) => {
            setSorter(value);
            setPageAbleValue({
              sort: value?.value ? [value.value] : undefined,
            });
          }}
          options={sortItems}
        />
      </div>

      {rows?.length > 0 && (
        <CourseContainer className="mb-3 flex-1">
          {rows?.map((course, index) => (
            <CourseItem key={index} course={course} viewDetail={true} />
          ))}
        </CourseContainer>
      )}
      {!rows?.length && (
        <div className="flex items-center justify-center h-[80%]">
          <NEmpty />
        </div>
      )}
      <div className="pt-5 pt-0">
        <NPagination
          pageInfo={pageInfo}
          updated={(pageAble) => setPageAbleValue(pageAble)}
        />
      </div>
    </div>
  );
};

export default SearchContent;
