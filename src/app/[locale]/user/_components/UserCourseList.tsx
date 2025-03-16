"use client";

import { Course } from "@/models";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";
import React, { useEffect, useState } from "react";
import {
  DropdownOption,
  List2Res,
  OrderBy,
  PageAble,
  PageInfo,
  SortOrder,
} from "@/models/utils.model";
import { DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import { CourseItem } from "@/components/CourseItem";
import NPagination from "@/components/_commons/NPagination";
import CourseContainer from "@/components/_commons/ContainerGrid";
import NInput from "@/components/_commons/NInput";
import useDebounce from "@/hooks/useDebounce";
import NSelection from "@/components/_commons/NSelection";
import I18n from "@/components/_commons/I18n";
import SvgIcon from "@/components/_commons/SvgIcon";
import NButton from "@/components/_commons/NButton";
import NEmpty from "@/components/_commons/NEmpty";

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
        await courseService.getMyCourses(pageAble);
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

      <div className="p-4 pt-0">
        <NPagination
          pageInfo={pageInfo}
          updated={(pageAble) => setPageAbleValue(pageAble)}
        />
      </div>
    </div>
  );
};

export default UserCourseList;
