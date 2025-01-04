import { Course } from "@/models";
import { courseService } from "@/services/course.service";
import { toastService } from "@/services/toast.service";
import React, { useEffect, useState } from "react";
import { CourseItem } from "../CourseItem";
import { List2Res, Pageable, PageInfo } from "@/models/utils.model";
import { useRouter } from "next/navigation";
import { DEFAULT_PAGESIZE, FIRST_PAGE, ROUTES } from "@/constants";
import { Pagination } from "antd";

const MyCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<PageInfo>();

  const [pageable, setPageable] = useState<Pageable>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
  });
  const router = useRouter();

  const getCourses = async () => {
    try {
      setLoading(true);
      const { content, ...res }: List2Res<Course> =
        await courseService.getMyCourses(pageable);
      setPageInfo(res);
      setCourses(content);
      setLoading(false);
    } catch (error) {
      toastService.error(error?.message);
      setLoading(false);
    }
  };


  useEffect(() => {
    if (pageable) {
      getCourses();
    }
  }, [pageable]);
  

  const changePage = (page, pageSize) => {
    setPageable({ ...pageable, page, size: pageSize });
  };


  const navigateDetail = (item: Course) => {
    router.push(`${ROUTES.INSTRUCTOR_COURSE}/${item.id}`);
  };

  return (
    <>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {courses?.map((course) => (
          <CourseItem
            course={course}
            key={course.id}
            onView={() => navigateDetail(course)}
          />
        ))}

      </div>

      <Pagination
          align="end"
          className="mt-4"
          defaultCurrent={1}
          total={pageInfo?.totalElements}
          current={pageInfo?.page}
          pageSize={pageInfo?.size}
          onChange={changePage}
        />
    </>
  );
};

export default MyCourse;
