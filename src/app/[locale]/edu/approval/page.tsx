"use client";

import NAvatar from "@/components/_commons/NAvatar";
import NTable, { TableColumns } from "@/components/_commons/NTable";
import StatusBadge from "@/components/CourseItem/StatusBadge";
import { formatDate } from "@/helpers/date";
import { useEffect, useRef, useState } from "react";
// import { TableRowSelection } from "antd/es/table/interface";
import { CourseStatus, DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import CensorFilter from "./_component/filter";
import { courseSearchService } from "@/services/courses/course-search.service";
import { List2Res, PageAble, PageInfo } from "@/models/utils.model";
import { Course, CourseSearchPayload } from "@/models";
import CustomImage from "@/components/_commons/CustomImage";
import { useModal } from "@/providers/ModalProvider";
import CourseConfirmDetail from "./_component/course-detail";
import { toastService } from "@/services/toast.service";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";
import I18n from "@/components/_commons/I18n";
import useEffectAfterMount from "@/hooks/useEffectSkipFirst";

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
    title: "Instructor",
    dataIndex: "owner",
    key: "owner",
    render: (user) => (
      <div className="flex gap-2 items-center">
        <NAvatar tooltip="" name={user.fullName} src={user.avatar} />
        <div className="flex flex-col justify-between space-y-1 leading-[1rem]">
          <div className="font-semibold ">{user.fullName}</div>
          <div className="text-black ">{user.email}</div>
        </div>
      </div>
    ),
    width: 300,
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => <span>{formatDate({date})}</span>,
    width: 150,
    sorter: true,
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (date) => <span>{formatDate({date})}</span>,
    width: 150,
    sorter: true,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status: CourseStatus) => <StatusBadge status={status} />,
    width: 200,
    fixed: "right",
    align: "center",
    sorter: true,
  },
];

const EduBoard: React.FC = () => {
  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [rows, setRows] = useState<Course[]>([]);
  const { openModal } = useModal();
  const [pageInfo, setPageInfo] = useState<PageInfo>();

  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
  });

  const [filter, setFilter] = useState<CourseSearchPayload>({
    status: [CourseStatus.PENDING],
  });

  // const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
  //   setSelectedRowKeys(newSelectedRowKeys);
  // };
  // const rowSelection: TableRowSelection<Course> = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCourses = async () => {
    try {
      const { content, ...res }: List2Res<Course> =
        await courseSearchService.getCourses(filter, pageAble);
      setRows(content);
      setPageInfo(res);
    } catch (error) {
      toastService.error(error?.message);

      setRows([]);
      setPageInfo(null);
    }
  };

  useEffectAfterMount(() => {
    getCourses();
  }, [filter, pageAble]); // Theo dõi pageAble thay đổi

  const handleTableChange = (newPageAble: PageAble) => {
    setPageAble((prevPageAble) => ({ ...prevPageAble, ...newPageAble }));
  };

  const changeFilter = (value: CourseSearchPayload) => {
    setFilter(value);
  };

  const updateCourse = (course: Course) => {
    if (!course) {
      return;
    }
    const updatedRows = [...rows];
    const item = updatedRows.find((e) => e.id === course.id);
    if (!item) {
      return;
    }
    Object.assign(item, course);
    setRows(updatedRows);
  };

  const openDetail = (item: Course) => {
    openModal({
      header: "View Detail",
      content: (
        <>
          <CourseConfirmDetail course={item} update={updateCourse} />
        </>
      ),
      onClose: () => {
      },
      config: {
        width: "1000px",
      },
    });
  };

  return (
    <div className="container mx-auto shadow-lg rounded-sm p-6 border border-[var(--n-border)]">
      <div className="font-semibold text-title-md mb-4">
        <I18n i18key={"Course Approval"} />
      </div>
      <CensorFilter
        changeFilter={changeFilter}
        onSearchText={(value) => handleTableChange({ keyword: value })}
      />

      <NTable<Course>
        columns={columns}
        dataSource={rows}
        pageInfo={pageInfo}
        updated={handleTableChange}
        scroll={{ x: "100%", y: "70vh" }}
        className="mt-5"
        onRow={(record, index) => {
          return {
            onClick: () => {
              openDetail(record);
            },
          };
        }}
      />
    </div>
  );
};

export default EduBoard;
