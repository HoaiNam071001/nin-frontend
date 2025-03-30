"use client";

import NAvatar from "@/components/_commons/NAvatar";
import NButton from "@/components/_commons/NButton";
import NInput from "@/components/_commons/NInput";
import NSelection from "@/components/_commons/NSelection";
import NTable, { TableColumns } from "@/components/_commons/NTable";
import NTooltip from "@/components/_commons/NTooltip";
import SvgIcon from "@/components/_commons/SvgIcon";
import UserStatusBadge from "@/components/User/UserStatusBadge";
import { DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import { formatDate } from "@/helpers/date";
import useAuth from "@/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { User } from "@/models";
import {
  DropdownOption,
  List2Res,
  OrderBy,
  PageAble,
  PageInfo,
  SortOrder,
} from "@/models/utils.model";
import { useModal } from "@/providers/ModalProvider";
import { adminService } from "@/services/admin/admin.service";
import { toastService } from "@/services/toast.service";
import { useEffect, useMemo, useState } from "react";
import RoleLabel from "./_components/RoleLabel";
import { UserSetting } from "./_components/UserSetting";

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

const UserList = ({ userId }) => {
  const { currentUser } = useAuth();
  const [rows, setRows] = useState<User[]>([]);

  const [pageAble, setPageAble] = useState<PageAble>({
    page: FIRST_PAGE,
    size: DEFAULT_PAGESIZE,
  });
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [keyword, setKeyword] = useState<string>();
  const searchTextDebounce = useDebounce(keyword, 500);
  const [sorter, setSorter] = useState<DropdownOption<OrderBy>>(sortItems[0]);
  const { openModal, openConfirm } = useModal();
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

  const setUser = (user: User) => {
    setRows((prevRows) => {
      const userIndex = prevRows.findIndex((row) => row.id === user.id);

      if (userIndex !== -1) {
        return [
          ...prevRows.slice(0, userIndex),
          user,
          ...prevRows.slice(userIndex + 1),
        ];
      } else {
        return [...prevRows, user];
      }
    });
  };

  const openDetail = (item: User) => {
    openModal({
      header: "Update User",
      content: (
        <>
          <UserSetting userId={item.id} update={setUser} />
        </>
      ),
      onClose: () => {},
      config: {
        width: "700px",
      },
    });
  };

  const onCreate = () => {
    openModal({
      header: "Create User",
      content: (
        <>
          <UserSetting create={setUser} />
        </>
      ),
      onClose: () => {},
      config: {
        width: "700px",
      },
    });
  };

  const onSwitch = async (item: User) => {
    try {
      const user = await adminService.switchUserStatus(item.id, !item.active);
      toastService.success("User status updated successfully");
      setUser(user);
    } catch (error) {
      toastService.error(error?.message || "Failed to update user status");
    }
  };

  const switchUser = (user: User) => {
    openConfirm({
      header: "Change User Status",
      content: `Are you sure you want to ${
        user.active ? "deactivate" : "activate"
      } this user?`,
      onOk: () => onSwitch(user),
    });
  };

  const columns: TableColumns<User> = useMemo(() => {
    const _columns: TableColumns<User> = [
      {
        title: "Name",
        dataIndex: "fullName",
        render: (_, record: User) => (
          <div className="flex items-center gap-2">
            <NAvatar
              src={record.avatar}
              name={record.fullName}
              userId={record.id}
              showName={true}
            />
          </div>
        ),
        width: 200,
        key: "fullName",
        fixed: "left",
        sorter: true,
      },
      {
        title: <div>Email</div>,
        dataIndex: "email",
        render: (_, record: User) => {
          return <div className="">{record.email}</div>;
        },
        width: 200,
        key: "email",
        sorter: true,
      },
      {
        title: <div>Roles</div>,
        dataIndex: "roles",
        render: (_, record: User) => {
          return (
            <div className="flex items-center gap-2">
              {record.roles.slice(0, 2).map((e) => (
                <RoleLabel key={e.roleName} role={e.roleName} />
              ))}
              {record.roles.length > 2 && (
                <NTooltip
                  color={"white"}
                  title={
                    <div className="flex gap-2 items-start">
                      {record.roles.slice(2).map((e) => (
                        <RoleLabel key={e.roleName} role={e.roleName} />
                      ))}
                    </div>
                  }
                >
                  <div className="px-2 bg-secondary text-white rounded-md">
                    +{record.roles.length - 2}
                  </div>
                </NTooltip>
              )}
            </div>
          );
        },
        width: 200,
        key: "roles",
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
        title: "Status",
        dataIndex: "active",
        key: "active",
        render: (active) => <UserStatusBadge active={active} />,
        width: 150,
        sorter: true,
      },
      {
        title: "",
        dataIndex: "action",
        key: "action",
        render: (_, user: User) => (
          <div className="flex items-center gap-2">
            <NButton
              size="sm"
              variant="filled"
              onClick={() => openDetail(user)}
            >
              <SvgIcon icon={"edit"} className="icon icon-sm" />
            </NButton>
            <NButton
              color={!user.active ? "green" : "red"}
              variant="filled"
              size="sm"
              tooltip={!user.active ? "Activate" : "Disable"}
              onClick={() => switchUser(user)}
            >
              <SvgIcon
                icon={user.active ? "remove" : "revert"}
                className="icon icon-sm"
              />
            </NButton>
          </div>
        ),
        width: 90,
      },
    ];
    return _columns;
  }, [userId]);

  const getUsers = async () => {
    try {
      // setLoading(true);
      const { content, ...res }: List2Res<User> = await adminService.getUsers(
        pageAble
      );
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
      getUsers();
    }
  }, [pageAble]);

  const handleTableChange = (newPageAble: PageAble) => {
    setPageAble((prevPageAble) => ({ ...prevPageAble, ...newPageAble }));
  };

  return (
    <div className="">
      <NButton className="mb-4" onClick={() => onCreate()}>
        Create
      </NButton>
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
      <NTable<User>
        columns={columns}
        dataSource={rows}
        updated={handleTableChange}
        pageInfo={pageInfo}
        scroll={{ x: "100%", y: "70vh" }}
        className="mt-5"
      />
    </div>
  );
};

export default UserList;
