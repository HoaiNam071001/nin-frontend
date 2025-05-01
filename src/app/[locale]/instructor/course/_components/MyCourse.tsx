import CustomImage from "@/components/_commons/CustomImage";
import NButton from "@/components/_commons/NButton";
import NInput from "@/components/_commons/NInput";
import NTable, { TableColumns } from "@/components/_commons/NTable";
import SvgIcon from "@/components/_commons/SvgIcon";
import StatusBadge from "@/components/CourseItem/StatusBadge";
import {
  CourseStatus,
  DEFAULT_PAGESIZE,
  FIRST_PAGE,
  ROUTES,
} from "@/constants";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";
import { formatNumber } from "@/helpers";
import { formatDate } from "@/helpers/date";
import useDebounce from "@/hooks/useDebounce";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { Course } from "@/models";
import { List2Res, PageAble, PageInfo } from "@/models/utils.model";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";
import { useEffect, useMemo, useState } from "react";

const MyCourse = () => {
  // const [loading, setLoading] = useState<boolean>(false);
  const [rows, setRows] = useState<Course[]>([]);

  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
  });
  const [pageInfo, setPageInfo] = useState<PageInfo>();

  const [keyword, setKeyword] = useState<string>();
  const searchTextDebounce = useDebounce(keyword, 500);

  const router = useI18nRouter();

  const columns: TableColumns<Course> = useMemo(() => {
    return [
      {
        title: "Id",
        dataIndex: "id",
        width: 50,
        key: "id",
        fixed: "left",
        sorter: true,
      },
      {
        title: "Name",
        dataIndex: "name",
        render: (_, record: Course) => (
          <div className="flex items-center gap-3">
            <CustomImage
              src={record.thumbnail || DEFAULT_COURSE_THUMBNAIL}
              alt="preview"
              className="w-[40px] h-[30px] rounded-md border-stroke border"
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
        title: "Price",
        dataIndex: "price",
        key: "price",
        render: (price, course: Course) => (
          <>
            {price > 0 && (
              <span>
                {formatNumber(price)} {course.currency}
              </span>
            )}
            {!price && (
              <span className="rounded-md bg-red px-2 py-1 text-white">
                Free
              </span>
            )}
          </>
        ),
        width: 150,
        sorter: true,
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => <span>{formatDate({ date })}</span>,
        width: 150,
        sorter: true,
      },
      {
        title: "Updated At",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (date) => <span>{formatDate({ date })}</span>,
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
      {
        title: "",
        dataIndex: "action",
        key: "action",
        render: (_, record: Course) => (
          <div className="flex items-center justify-center gap-2">
            <NButton
              size="sm"
              variant="filled"
              onClick={() => router.push(`${ROUTES.COURSE}/${record.slug}`)}
            >
              <SvgIcon icon={"eye"} className="icon icon-sm" />
            </NButton>
            <NButton
              size="sm"
              variant="filled"
              color="gray"
              onClick={() =>
                router.push(`${ROUTES.INSTRUCTOR_COURSE}/${record.id}`)
              }
            >
              <SvgIcon icon={"edit"} className="icon icon-sm" />
            </NButton>
          </div>
        ),
        width: 80,
        fixed: "right",
        align: "center",
      },
    ];
  }, [rows]);

  useEffect(() => {
    setPageAbleValue({ keyword });
  }, [searchTextDebounce]);

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

  const setPageAbleValue = (value: PageAble) => {
    setPageAble({
      ...pageAble,
      ...value,
    });
  };

  useEffect(() => {
    if (pageAble) {
      getCourses();
    }
  }, [pageAble]);

  const handleTableChange = (newPageAble: PageAble) => {
    setPageAble((prevPageAble) => ({ ...prevPageAble, ...newPageAble }));
  };
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex mb-3">
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
      <div className="flex-1">
        <NTable<Course>
          columns={columns}
          dataSource={rows}
          updated={handleTableChange}
          pageInfo={pageInfo}
          className="h-full"
          onRow={(record) => {
            return {
              onClick: () => {},
            };
          }}
        />
      </div>
    </div>
  );
};

export default MyCourse;
