"use client";

import NButton from "@/components/_commons/NButton";
import { useEffect, useMemo, useState } from "react";
import CourseSub from "./CourseSub";
import CourseChart from "./CourseChart";
import moment from "moment";
import { DATE_FORMATS } from "@/constants";
import NInput from "@/components/_commons/NInput";
import { ChartCoursePayload } from "@/models/course/course-subscription.model";
import { DashboardSubPayload } from "@/models/admin/course-admin.model";
import NSelection from "@/components/_commons/NSelection";
import { ShortUser, User } from "@/models";
import { DropdownOption, List2Res } from "@/models/utils.model";
import { userService } from "@/services/user/user.service";
import NAvatar from "@/components/_commons/NAvatar";

const CourseTab: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>(
    moment().subtract(6, "d").format(DATE_FORMATS.FULL_DATE_NO_TIME)
  );
  const [toDate, setToDate] = useState<string>(
    moment().endOf("d").format(DATE_FORMATS.FULL_DATE_NO_TIME)
  );
  const [selectedUsers, setSelectedUsers] = useState<ShortUser[]>([]);
  const [userList, setUserList] = useState<ShortUser[]>([]);

  const [filter, setFilter] = useState<DashboardSubPayload>();

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

  useEffect(() => {
    searchUser("");
  }, []);

  useEffect(() => {
    setFilter({
      startDate: moment
        .utc(fromDate, DATE_FORMATS.FULL_DATE_NO_TIME)
        .toISOString(),
      endDate: moment
        .utc(toDate, DATE_FORMATS.FULL_DATE_NO_TIME)
        .endOf("d")
        .toISOString(),
      userIds: selectedUsers.map((e) => e.id),
    });
  }, [fromDate, toDate, selectedUsers]);

  const render = (item: ShortUser) => {
    return (
      <NAvatar
        src={item.avatar}
        name={item.fullName}
        showName={true}
        email={item.email}
      />
    );
  };

  return (
    <div className="w-full container mx-auto rounded-md shadow h-full overflow-auto">
      <div className="flex items-center gap-4 sticky top-0 bg-slate-200 z-10 pt-4 px-4 border-b border-stroke">
        <div className="form-group">
          <label>From Date</label>
          <NInput
            type="date"
            value={fromDate}
            onValueChange={(value) => setFromDate(value as string)}
          />
        </div>
        <div className="form-group">
          <label>To Date</label>
          <NInput
            type="date"
            value={toDate}
            onValueChange={(value) => setToDate(value as string)}
          />
        </div>

        <div className="form-group">
          <label>Owners</label>
          <NSelection<ShortUser>
            value={selectedUsers}
            className="min-w-[300px]"
            searchable={true}
            compareField={"id"}
            renderLabel={render}
            renderOption={render}
            multiple={true}
            clearable={true}
            onChange={(value: ShortUser[]) => {
              setSelectedUsers(value);
            }}
            placeholder="Select Owner"
            onSearch={searchUser}
            options={userList}
          />
        </div>
      </div>
      <div className="px-4 space-y-4 bg-slate-50 ">
        <CourseChart filter={filter}></CourseChart>
        <CourseSub filter={filter}></CourseSub>
      </div>
    </div>
  );
};

export default CourseTab;
