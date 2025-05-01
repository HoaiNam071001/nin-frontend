import CustomImage from "@/components/_commons/CustomImage";
import NButton from "@/components/_commons/NButton";
import NDropdown from "@/components/_commons/NDropdown";
import NInput from "@/components/_commons/NInput";
import NSelection from "@/components/_commons/NSelection";
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
import { formatDate } from "@/helpers/date";
import useAuth from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { Course, CourseAccessType, InstructorTypes } from "@/models";
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
import { useEffect, useMemo, useState } from "react";

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

const UserCollaboration = ({ userId }) => {
  const { currentUser } = useAuth();
  const [rows, setRows] = useState<Course[]>([]);

  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
  });
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [keyword, setKeyword] = useState<string>();
  const searchTextDebounce = useDebounce(keyword, 500);
  const [sorter, setSorter] = useState<DropdownOption<OrderBy>>(sortItems[0]);

  const router = useI18nRouter();

  useEffect(() => {
    setPageAbleValue({ keyword });
  }, [searchTextDebounce]);

  const setPageAbleValue = (value: PageAble) => {
    setPageAble({
      ...pageAble,
      ...value,
    });
  };

  const navigateEditPage = (courseId: number) => {
    router.push(`${ROUTES.INSTRUCTOR_COURSE}/${courseId}`);
  };

  const navigateViewPage = (course: Course) => {
    router.push(`${ROUTES.COURSE}/${course.slug}`);
  };

  const columns: TableColumns<Course> = useMemo(() => {
    const _columns: TableColumns<Course> = [
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
          <div className="flex items-center gap-2">
            <CustomImage
              src={record.thumbnail || DEFAULT_COURSE_THUMBNAIL}
              alt="preview"
              className="w-[50px] h-[35px] rounded-sm border-stroke border"
            />
            <span>{}</span>
            <NButton
              variant="link"
              className="hover:underline !p-0 text-left line-clamp-2 overflow-hidden"
              color="black"
              onClick={() => navigateViewPage(record)}
            >
              {record.name}
            </NButton>
          </div>
        ),
        width: 300,
        key: "name",
        fixed: "left",
        sorter: true,
      },
      {
        title: <div>Role</div>,
        dataIndex: "role",
        render: (_, record: Course) => {
          const type = record.instructors.find(
            (e) => e.user?.id === userId
          )?.type;
          return (
            <div className="flex items-center gap-3">
              {InstructorTypes.find((e) => e.value === type).name}
            </div>
          );
        },
        width: 200,
        key: "role",
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: CourseStatus) => <StatusBadge status={status} />,
        width: 180,
        align: "center",
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
    ];
    if (currentUser?.id === userId) {
      _columns.push({
        title: "",
        dataIndex: "edit",
        key: "edit",
        render: (_, record: Course) => {
          const type = record.instructors.find((e) => e.user?.id === userId);
          return (
            <>
              {type.accessType === CourseAccessType.EDIT && (
                <NDropdown
                  items={[
                    {
                      key: "edit",
                      label: (
                        <div className="flex space-x-2 items-center">
                          <SvgIcon
                            className="icon icon-sm"
                            icon="edit"
                          ></SvgIcon>
                          <span>Edit</span>
                        </div>
                      ),
                      onClick: () => navigateEditPage(record.id),
                    },
                  ]}
                />
              )}
            </>
          );
        },
        width: 45,
        fixed: "right",
        align: "center",
      });
    }
    return _columns;
  }, [userId]);

  const getCourses = async () => {
    try {
      // setLoading(true);
      const { content, ...res }: List2Res<Course> =
        await courseSearchService.getByInstructor(userId, pageAble);
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

  return (
    <div className="">
      <div className="flex items-center mb-5">
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
      <NTable<Course>
        columns={columns}
        dataSource={rows}
        updated={handleTableChange}
        pageInfo={pageInfo}
        className="mt-5"
      />
    </div>
  );
};

export default UserCollaboration;
