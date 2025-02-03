import { Course } from "@/models";
import { courseService } from "@/services/course.service";
import { toastService } from "@/services/toast.service";
import React, { useEffect, useState } from "react";
import { List2Res, PageAble, PageInfo } from "@/models/utils.model";
import {
  CourseStatus,
  DEFAULT_PAGESIZE,
  FIRST_PAGE,
  ROUTES,
} from "@/constants";
import NTable, { TableColumns } from "@/components/_commons/NTable";
import CustomImage from "@/components/_commons/CustomImage";
import { formatDate } from "@/helpers/date";
import StatusBadge from "@/components/CourseItem/StatusBadge";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";
import { useI18nRouter } from "@/hooks/useI18nRouter";

const columns: TableColumns<Course> = [
  {
    title: "Name",
    dataIndex: "name",
    render: (_, record: Course) => (
      <div className="flex items-center gap-3">
        <CustomImage
          src={record.thumbnail || DEFAULT_COURSE_THUMBNAIL}
          alt="preview"
          className="min-w-[80px] w-[80px] h-[50px] rounded-lg border-stroke border"
        />
        <span>{record.name}</span>
      </div>
    ),
    width: 400,
    key: "name",
    fixed: "left",
    sorter: true,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => <span>{formatDate(date)}</span>,
    width: 150,
    sorter: true,
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (date) => <span>{formatDate(date)}</span>,
    width: 150,
    sorter: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: CourseStatus) => <StatusBadge status={status} />,
    width: 150,
    fixed: "right",
    align: "center",
    sorter: true,
  },
];

const MyCourse = () => {
  // const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Course[]>([]);
  
  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
  });
  const [pageInfo, setPageInfo] = useState<PageInfo>();

  const router = useI18nRouter();

  const getCourses = async () => {
    try {
      // setLoading(true);
      const { content, ...res }: List2Res<Course> =
        await courseService.getMyCourses(pageAble);
      setRows(content);
      setPageInfo(res);
      // setLoading(false);
    } catch (error) {
      toastService.error(error?.message);
      // setLoading(false);
      setRows([]);
      setPageInfo(null);
    }
  };

  useEffect(() => {
    if (pageAble) {
      getCourses();
    }
  }, [pageAble]);

  const handleTableChange = (newPageAble: PageAble) => {
    setPageAble((prevPageAble) => ({ ...prevPageAble, ...newPageAble }));
  };

  const navigateDetail = (item: Course) => {
    router.push(`${ROUTES.INSTRUCTOR_COURSE}/${item.id}`);
  };

  return (
    <div className="">
      <NTable<Course>
        columns={columns}
        dataSource={rows}
        updated={handleTableChange}
        pageInfo={pageInfo}
        scroll={{ x: "100%", y: "70vh" }}
        className="mt-5"
        onRow={(record) => {
          return {
            onClick: () => {
              navigateDetail(record);
            },
          };
        }}
      />
    </div>
  );
};

export default MyCourse;
