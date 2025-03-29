import { Course, User } from "@/models";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";
import React, { useEffect, useState } from "react";
import {
  Currency,
  List2Res,
  PageAble,
  PageInfo,
  SortOrder,
} from "@/models/utils.model";
import {
  CourseStatus,
  DEFAULT_PAGESIZE,
  FIRST_PAGE,
  ROUTES,
} from "@/constants";
import NTable, { TableColumns } from "@/components/_commons/NTable";
import CustomImage from "@/components/_commons/CustomImage";
import { formatDate } from "@/helpers/date";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";
import { coursePaymentService } from "@/services/courses/course-subscription.service";
import { CourseSubscriptionFull } from "@/models/course/course-subscription.model";
import { formatNumber } from "@/helpers";
import NAvatar from "@/components/_commons/NAvatar";
import useDebounce from "@/hooks/useDebounce";
import NInput from "@/components/_commons/NInput";
import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import { DashboardSubPayload } from "@/models/admin/course-admin.model";
import { courseAdminService } from "@/services/admin/course-admin.service";

const columns: TableColumns<CourseSubscriptionFull> = [
  {
    title: "Name",
    dataIndex: "name",
    render: (_, record: CourseSubscriptionFull) => (
      <div className="flex items-center gap-3">
        <CustomImage
          src={record.course?.thumbnail || DEFAULT_COURSE_THUMBNAIL}
          alt="preview"
          className="w-[40px] h-[30px] border-stroke border"
        />
        <span>{record.course?.name}</span>
      </div>
    ),
    width: 400,
    key: "name",
    fixed: "left",
  },
  {
    title: "Owner",
    dataIndex: "owner",
    key: "owner",
    render: (_, row: CourseSubscriptionFull) => (
      <div className="cursor-pointer">
        <NAvatar
          src={row.course.owner?.avatar}
          userId={row.course.owner?.id}
          name={row.course.owner?.fullName}
          showName={true}
        />
      </div>
    ),
    width: 150,
  },
  {
    title: "User",
    dataIndex: "user",
    key: "user",
    render: (user: User) => (
      <div className="cursor-pointer">
        <NAvatar
          src={user.avatar}
          userId={user.id}
          name={user.fullName}
          showName={true}
        />
      </div>
    ),
    width: 150,
  },
  {
    title: "Payment Date",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => <span>{formatDate({ date })}</span>,
    width: 150,
    sorter: true,
  },
  {
    title: "Amount",
    dataIndex: "payment.amount",
    key: "payment.amount",
    render: (_, item: CourseSubscriptionFull) => (
      <span>
        {formatNumber(+item.payment?.amount)}{" "}
        {item.payment?.currency || Currency.VND}
      </span>
    ),
    width: 150,
  },
];

const CourseSub = ({ filter }: { filter: DashboardSubPayload }) => {
  const [keyword, setKeyword] = useState<string>();
  const searchTextDebounce = useDebounce(keyword, 500);
  const [rows, setRows] = useState<CourseSubscriptionFull[]>([]);
  useEffect(() => {
    setPageAble({ ...pageAble, keyword });
  }, [searchTextDebounce]);

  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
    sort: [
      {
        property: "createdAt",
        direction: SortOrder.ASC,
      },
    ],
  });
  const [pageInfo, setPageInfo] = useState<PageInfo>();

  const getCourses = async () => {
    try {
      const { content, ...res }: List2Res<CourseSubscriptionFull> =
        await courseAdminService.getSubscriptionByCourse(
          filter,
          pageAble
        );
      setRows(content);
      setPageInfo(res);
    } catch (error) {
      toastService.error(error?.message);
      setRows([]);
      setPageInfo(null);
    }
  };

  useEffect(() => {
    if (pageAble && filter) {
      getCourses();
    }
  }, [pageAble, filter]);

  const handleTableChange = (newPageAble: PageAble) => {
    setPageAble((prevPageAble) => ({ ...prevPageAble, ...newPageAble }));
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
      </div>
      <NTable<CourseSubscriptionFull>
        columns={columns}
        dataSource={rows}
        updated={handleTableChange}
        pageInfo={pageInfo}
        scroll={{ x: "100%", y: "70vh" }}
        className="mt-5"
        onRow={(record) => {
          return {
            onClick: () => {},
          };
        }}
      />
    </div>
  );
};

export default CourseSub;
