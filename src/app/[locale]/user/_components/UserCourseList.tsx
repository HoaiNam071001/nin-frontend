"use client";

import { CourseItem } from "@/components/CourseItem";
import CourseContainer from "@/components/_commons/ContainerGrid";
import NButton from "@/components/_commons/NButton";
import NEmpty from "@/components/_commons/NEmpty";
import NInput from "@/components/_commons/NInput";
import NPagination from "@/components/_commons/NPagination";
import NSelection from "@/components/_commons/NSelection";
import SvgIcon from "@/components/_commons/SvgIcon";
import { DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import useDebounce from "@/hooks/useDebounce";
import { Course } from "@/models";
import {
  DropdownOption,
  List2Res,
  OrderBy,
  PageAble,
  PageInfo,
  SortOrder,
} from "@/models/utils.model";
import { courseSearchService } from "@/services/courses/course-search.service";
import { toastService } from "@/services/toast.service";
import { useEffect, useState } from "react";

const sortItems: DropdownOption<OrderBy>[] = [
  {
    name: "Newest",
    value: {
      property: "createdAt",
      direction: SortOrder.DESC,
    },
  },
  {
    name: "Oldest",
    value: {
      property: "createdAt",
      direction: SortOrder.ASC,
    },
  },
];

const UserCourseList = ({ userId }) => {
  const [rows, setRows] = useState<Course[]>([]);

  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
  });
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [keyword, setKeyword] = useState<string>();
  const searchTextDebounce = useDebounce(keyword, 500);
  const [sorter, setSorter] = useState<DropdownOption<OrderBy>>(sortItems[0]);

  const getCourses = async () => {
    try {
      const { content, ...res }: List2Res<Course> =
        await courseSearchService.getPublicByUser(userId, pageAble);
      setRows(content);
      setPageInfo(res);
    } catch (error) {
      toastService.error(error?.message);
      setRows([]);
      setPageInfo(null);
    }
  };

  useEffect(() => {
    if (pageAble) {
      getCourses();
    }
  }, [pageAble]);

  useEffect(() => {
    setPageAbleValue({ keyword });
  }, [searchTextDebounce]);

  const setPageAbleValue = (value: PageAble) => {
    setPageAble({
      ...pageAble,
      ...value,
    });
  };

  return (
    <div className="">
      <div className="flex items-center mb-4">
        <NInput
          value={keyword}
          onValueChange={(value: string) => setKeyword(value)}
          placeholder="Search Course..."
          addonAfter={
            <NButton
              variant="link"
              color="secondary"
              onClick={() => setKeyword(keyword)}
            >
              <SvgIcon icon="search" className="icon icon-sm" />
            </NButton>
          }
        ></NInput>

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
        <div className="course-container">
          <CourseContainer>
            {rows?.map((course, index) => (
              <CourseItem key={index} course={course} viewDetail={true} />
            ))}
          </CourseContainer>
        </div>
      )}
      {!rows?.length && (
        <div className="flex items-center justify-center h-[50vh]">
          <NEmpty />
        </div>
      )}

      <div className="p-4 pt-4">
        <NPagination
          pageInfo={pageInfo}
          updated={(pageAble) => setPageAbleValue(pageAble)}
        />
      </div>
    </div>
  );
};

export default UserCourseList;
