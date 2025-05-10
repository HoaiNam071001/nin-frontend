"use client";

import CustomImage from "@/components/_commons/CustomImage";
import I18n from "@/components/_commons/I18n";
import NAvatar from "@/components/_commons/NAvatar";
import NSelection from "@/components/_commons/NSelection";
import NTable, { TableColumns } from "@/components/_commons/NTable";
import VideoControl from "@/components/_commons/VideoControl";
import PieChart, { PieChartData } from "@/components/Chart/PieChart";
import { DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import { formatDate, formatFileSize } from "@/helpers";
import { ShortUser } from "@/models";
import { NFile } from "@/models/file.model";
import { List2Res, PageAble, PageInfo } from "@/models/utils.model";
import { useModal } from "@/providers/ModalProvider";
import { adminService } from "@/services/admin/admin.service";
import { fileService } from "@/services/file.service";
import { toastService } from "@/services/toast.service";
import { userService } from "@/services/user/user.service";
import { useEffect, useMemo, useState } from "react";

const FilePanel = () => {
  const [report, setReport] = useState<PieChartData[]>([]);
  const [sum, setSum] = useState<number>(0);

  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
  });
  const [userFilter, setUserFilter] = useState<ShortUser[]>([]);
  const [courseIds, setCourseIds] = useState<number[]>([]);
  const [list, setList] = useState<NFile[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [userList, setUserList] = useState<ShortUser[]>();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const item = await adminService.getCountFile();
        setReport(
          item
            ?.map((e) => ({
              label: e.user?.email || "Others",
              value: e.size,
              extends: {
                user: e.user,
                count: e.count,
              },
            }))
            .sort((a, b) => {
              // If both are "Others", maintain order
              if (a.label === "Others" && b.label === "Others") return 0;
              // If a is "Others", push it to the end
              if (a.label === "Others") return 1;
              // If b is "Others", push it to the end
              if (b.label === "Others") return -1;
              // Otherwise, sort by value in descending order
              return b.value - a.value;
            })
        );
        setSum(item.reduce((res, cur) => res + cur.size, 0));
      } catch (error: any) {
        toastService.error(error?.message || "500 Error");
      }
    };

    fetchInfo();
  }, []);

  const searchUser = async (text: string) => {
    try {
      const { content }: List2Res<ShortUser> = await userService.get(
        {},
        {
          keyword: text,
        }
      );
      setUserList(content);
    } catch (error) {
      setUserList([]);
    }
  };

  const fetchList = async () => {
    try {
      const { content, ...res } = await fileService.getList(pageAble, {
        userIds: userFilter?.map((e) => e.id),
        courseIds,
      });
      setList(content);
      setPageInfo(res);
    } catch (error: any) {
      setList([]);
      toastService.error(error?.message || "500 Error");
    }
  };

  const viewFile = (file: NFile) => {
    openModal({
      content: (
        <div className="flex justify-center">
          {file.type?.includes("image") ? (
            <CustomImage src={file.url} width={500} />
          ) : file.type?.includes("video") ? (
            <VideoControl videoSrc={file?.url} />
          ) : (
            <></>
          )}
        </div>
      ),
      header: <I18n i18key={"View File"} />,
      onClose: () => {},
      config: { width: "800px" },
    });
  };

  const columns: TableColumns<NFile> = useMemo(() => {
    const _columns: TableColumns<NFile> = [
      {
        title: "id",
        dataIndex: "id",
        width: 50,
        key: "id",
        sorter: true,
      },
      {
        title: "File Name",
        dataIndex: "name",
        width: 200,
        key: "name",
        render: (_, record: NFile) => (
          <div
            className="max-w-[300px] text-ellipsis h-full"
            onClick={() => viewFile(record)}
          >
            {_}
          </div>
        ),
        sorter: true,
      },
      {
        title: "User",
        dataIndex: "user",
        render: (_, record: NFile) => (
          <div className="flex items-center gap-2">
            <NAvatar
              src={record.user?.avatar}
              name={record.user?.fullName}
              userId={record.user?.id}
              showName={true}
            />
          </div>
        ),
        width: 200,
        key: "user",
        sorter: true,
      },
      {
        title: "size",
        dataIndex: "size",
        width: 100,
        render: (size) => <span>{formatFileSize(size)}</span>,
        key: "size",
        sorter: true,
      },
      {
        title: "Type",
        dataIndex: "type",
        width: 100,
        key: "type",
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
      //   {
      //     title: "course",
      //     dataIndex: "course",
      //     width: 200,
      //     render: (course) => (
      //       <div className="flex items-center gap-3">
      //         {course ? (
      //           <>
      //             <CustomImage
      //               src={course?.thumbnail || DEFAULT_COURSE_THUMBNAIL}
      //               alt="preview"
      //               className="w-[50px] h-[35px] rounded-md border-stroke border"
      //             />
      //             <span>{course?.name}</span>
      //           </>
      //         ) : (
      //           <></>
      //         )}
      //       </div>
      //     ),
      //     key: "course",
      //     sorter: true,
      //   },
    ];
    return _columns;
  }, []);

  useEffect(() => {
    if (pageAble) {
      fetchList();
    }
  }, [pageAble, userFilter]);

  const handleTableChange = (newPageAble: PageAble) => {
    setPageAble((prevPageAble) => ({ ...prevPageAble, ...newPageAble }));
  };

  const UserLabel = (val: ShortUser) => (
    <NAvatar
      src={val.avatar}
      name={val.fullName}
      email={val.email}
      showName={true}
    />
  );

  return (
    <div className="">
      <PieChart
        data={report}
        width={300}
        height={200}
        innerRadius={60}
        customTooltip={customTooltip}
        centerContent={
          <div>
            <div className="text-[30px] relative flex items-center justify-center gap-2">
              {formatFileSize(sum)}
            </div>
          </div>
        }
        outerRadius={80}
      />

      <NSelection
        className="min-w-[300px] mt-4"
        value={userFilter}
        placeholder={"Filter by User"}
        searchable={true}
        multiple={true}
        clearable={true}
        options={userList}
        searchOnFirstOpen={true}
        onSearch={searchUser}
        renderLabel={UserLabel}
        renderOption={UserLabel}
        onChange={(value: ShortUser[]) => setUserFilter(value)}
      />
      <NTable<NFile>
        columns={columns}
        dataSource={list}
        updated={handleTableChange}
        pageInfo={pageInfo}
        className="mt-5"
      />
    </div>
  );
};

export default FilePanel;

const customTooltip = (data: PieChartData) => (
  <div className="bg-white">
    <div className="mb-2">
      {data.extends?.user ? (
        <NAvatar
          src={data.extends.user?.avatar}
          name={data.extends.user?.fullName}
          email={data.extends.user?.email}
          userId={data.extends.user?.id}
          showName={true}
        />
      ) : (
        <div className="font-semibold">Others</div>
      )}
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Size:</div> {formatFileSize(data.value)}
    </div>
    <div className="flex gap-2">
      <div className="font-semibold">Quantity:</div> {data.extends?.count || 0}
    </div>
  </div>
);
