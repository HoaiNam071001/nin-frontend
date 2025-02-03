"use client";

import { CourseItem } from "@/components/CourseItem";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { SearchContext } from "../page";
import {
  DropdownOption,
  List2Res,
  OrderBy,
  PageAble,
  PageInfo,
  SortOrder,
} from "@/models/utils.model";
import { Course } from "@/models";
import { courseSearchService } from "@/services/course-search.service";
import { DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import NPagination from "@/components/_commons/NPagination";
import { toastService } from "@/services/toast.service";
import NDropdown from "@/components/_commons/NDropdown";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import I18n from "@/components/_commons/I18n";

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
  useEffect(() => {
    console.log("keyword", keyword);
  }, [keyword]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false; // Đánh dấu đã render lần đầu tiên
      return; // Bỏ qua lần render đầu tiên
    }
    console.log("fetchCourses");
    fetchCourses();
  }, [context.filter, pageAble, keyword]);

  const setPageAbleValue = (value: PageAble) => {
    console.log("setPageAbleValue", value);
    setPageAble({
      ...pageAble,
      ...value,
    });
  };

  return (
    <div className="overflow-auto px-3 rounded-md relative">
      <div className="flex sticky top-0 z-10 bg-white py-3">
        <div className="font-semibold text-title-sm">
          <I18n i18key={"Search"}/>
        </div>
        <NDropdown
          value={sorter}
          bindLabel="name"
          className="ml-auto"
          onChange={(value) => {
            setSorter(value);
            setPageAbleValue({
              sort: value?.value ? [value.value] : undefined,
            });
          }}
          options={sortItems}
        />
      </div>

      <div className="mb-3 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-auto flex-1">
        {rows?.map((course, index) => (
          <CourseItem key={index} course={course} />
        ))}
      </div>
      <div className="p-4 pt-0">
        <NPagination
          pageInfo={pageInfo}
          updated={(pageAble) => setPageAbleValue(pageAble)}
        />
      </div>
    </div>
  );
};

export default SearchContent;
