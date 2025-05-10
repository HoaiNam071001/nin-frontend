"use client";

import { PARAMS, ROUTES } from "@/constants";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import { NotificationModel } from "@/models/user/notification.model";
import { notificationsService } from "@/services/user/notification.service";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import CustomDropdown from "../_commons/CustomDropdown";
import NButton from "../_commons/NButton";
import SvgIcon from "../_commons/SvgIcon";
import NotificationList from "../Notification/NotificationList";

const NotificationDropdown: React.FC = () => {
  const router = useI18nRouter();
  const [count, setCount] = useState(0);

  const countUnRead = async () => {
    try {
      const _count = await notificationsService.countUnRead();
      setCount(_count);
    } catch (error) {}
  };
  const handleNotificationClick = (notification: NotificationModel) => {
    router.push(
      `${ROUTES.NOTIFICATION}?${queryString.stringify({
        [PARAMS.NOTIFICATION.ID]: notification.id,
      })}`
    );
    countUnRead();
  };

  useEffect(() => {
    countUnRead();
  }, []);

  return (
    <CustomDropdown
      dWidth={350}
      dHeight={500}
      onOpen={() => countUnRead()}
      trigger={
        <NButton variant="link" size="md-circle" color="black" shape="full">
          <SvgIcon icon={"bell"} className="icon icon-md" />
          {!!count && (
            <div className="absolute top-0 left-[50%] bg-red-500 text-white w-max h-4 px-1 text-[10px] rounded-full">
              {count || 0}
            </div>
          )}
        </NButton>
      }
    >
      {(closeDropdown) => (
        <NotificationList
          onNotificationClick={(item) => {
            handleNotificationClick(item);
            closeDropdown();
          }}
        />
      )}
    </CustomDropdown>
  );
};

export default NotificationDropdown;
