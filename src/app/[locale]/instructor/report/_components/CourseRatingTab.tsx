import CustomImage from "@/components/_commons/CustomImage";
import NButton from "@/components/_commons/NButton";
import NInput from "@/components/_commons/NInput";
import NTable, { TableColumns } from "@/components/_commons/NTable";
import Rating from "@/components/_commons/Rating";
import SvgIcon from "@/components/_commons/SvgIcon";
import { DEFAULT_PAGESIZE, FIRST_PAGE, ROUTES } from "@/constants";
import { DEFAULT_COURSE_THUMBNAIL } from "@/constants/consts/course";
import { formatDate } from "@/helpers/date";
import useDebounce from "@/hooks/useDebounce";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { Course } from "@/models";
import { List2Res, PageAble, PageInfo } from "@/models/utils.model";
import { courseService } from "@/services/courses/course.service";
import { toastService } from "@/services/toast.service";
import { useEffect, useMemo, useState } from "react";
import CourseRatingChart from "./CourseRatingChart";

const RatingTab = () => {
  const [rows, setRows] = useState<Course[]>([]);
  const [selected, setSelected] = useState<Course | null>(null); // Thêm type null để tránh lỗi

  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
  });
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [keyword, setKeyword] = useState<string>();
  const searchTextDebounce = useDebounce(keyword, 500);

  const router = useI18nRouter();
  useEffect(() => {
    handleTableChange({ keyword });
  }, [searchTextDebounce]);

  const columns: TableColumns<Course> = useMemo(() => {
    return [
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
            <span className="">{record.name}</span>
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
        render: (date) => <span>{formatDate({ date })}</span>,
        width: 150,
        sorter: true,
      },
      {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
        render: (rating) => (
          <div className="flex items-center gap-2">
            <div>{rating}</div>
            <Rating size="sm" maxStars={1} initialValue={1} />
          </div>
        ),
        width: 150,
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

  const handleTableChange = (newPageAble: PageAble) => {
    setPageAble((prevPageAble) => ({ ...prevPageAble, ...newPageAble }));
  };

  return (
    <div>
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[70vh]">
        <div
          className={`px-2 col-span-12 ${
            selected ? "md:col-span-8" : "md:col-span-12"
          }`}
        >
          <NTable<Course>
            columns={columns}
            dataSource={rows}
            updated={handleTableChange}
            pageInfo={pageInfo}
            scroll={{ x: "100%", y: "70vh" }}
            onRow={(record) => {
              return {
                onClick: () => {
                  setSelected(record);
                },
              };
            }}
            rowClassName={(record) =>
              selected && record.id === selected.id ? "selected" : ""
            }
          />
        </div>
        {selected && (
          <div className="col-span-12 md:col-span-4 relative">
            <NButton
              className="absolute top-0 right-0"
              variant="filled"
              color="gray"
              onClick={() => setSelected(null)}
            >
              <SvgIcon icon={"close"} />
            </NButton>
            <CourseRatingChart courseId={selected.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingTab;
