"use client";

import { FIRST_PAGE } from "@/constants";
import {
  NotificationContext,
  NotificationModel,
  NotificationStatus,
} from "@/models/user/notification.model";
import { List2Res, PageInfo } from "@/models/utils.model";
import { notificationsService } from "@/services/user/notification.service";
import { uniqBy } from "lodash";
import { useEffect, useState } from "react";
import CustomImage from "../_commons/CustomImage";
import InfiniteScroll from "../_commons/InfiniteScroll";
import NButton from "../_commons/NButton";
import SvgIcon from "../_commons/SvgIcon";
import TimeAgo from "../_commons/TimeAgo";

interface NotificationListProps {
  selectedId?: number;
  onNotificationClick: (notification: NotificationModel) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  selectedId,
  onNotificationClick,
}) => {
  const [rows, setRows] = useState<NotificationModel[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>();
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async (page = FIRST_PAGE) => {
    try {
      if (loading) {
        return;
      }
      setLoading(true);
      const { content, ...res }: List2Res<NotificationModel> =
        await notificationsService.find({ page });
      if (page === FIRST_PAGE) {
        setRows(content);
      } else {
        const combinedRows = [...rows, ...content];
        const uniqueRows = uniqBy(combinedRows, "id");
        setRows(uniqueRows);
      }
      setPageInfo(res);
      setLoading(false);
    } catch (error) {
      setRows([]);
      setLoading(false);
    }
  };

  const updateNotification = async (notification?: NotificationModel) => {
    try {
      if (!notification) {
        await notificationsService.readAll();
        const updatedRows = rows.map((row) => ({
          ...row,
          status: NotificationStatus.READ,
        }));
        setRows(updatedRows);

        return;
      }
      if (notification.status === NotificationStatus.READ) {
        return;
      }
      const item = await notificationsService.update(notification.id, {
        status: NotificationStatus.READ,
      });
      const updatedRows = rows.map((row) =>
        row.id === notification.id ? item : row
      );
      setRows(updatedRows);
    } catch (error) {
      setRows([]);
      setLoading(false);
    }
  };

  const handleClick = (notification: NotificationModel) => {
    onNotificationClick(notification);
    updateNotification(notification);
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case "markAllRead":
        updateNotification();
        break;
      case "refresh":
        fetchNotifications(FIRST_PAGE);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center px-3 py-2 border-b border-stroke sticky top-0  z-999 bg-white">
        <div className="text-title-sm font-semibold">Notifications</div>
        <div className="flex items-center gap-1">
          <NButton
            variant="text"
            shape="full"
            size="md-circle"
            tooltip="Refresh"
            onClick={() => handleMenuAction("refresh")}
          >
            <SvgIcon icon={"refresh"} className="icon icon-sm" />
          </NButton>
          <NButton
            variant="link"
            className="!px-0"
            onClick={() => handleMenuAction("markAllRead")}
          >
            Mark all as read
          </NButton>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <InfiniteScroll
          onLoadMore={() => fetchNotifications(pageInfo?.page! + 1)}
          hasMore={pageInfo?.page !== pageInfo?.totalPages}
          isLoading={loading}
        >
          {rows.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 relative border-b border-stroke flex gap-2 cursor-pointer ${
                selectedId === notification.id
                  ? "bg-system bg-opacity-10"
                  : notification.status === NotificationStatus.UNREAD
                  ? "bg-slate-50"
                  : "hover:bg-[var(--n-row-hover)]"
              }`}
              onClick={() => handleClick(notification)}
            >
              <div className="flex items-center w-[50px]">
                <CustomImage src={notification.course?.thumbnail} width={50} />
              </div>

              <div className="flex flex-col">
                <div className="font-semibold">
                  {NotificationContext[notification.type].title}
                </div>
                <h3 className="text-ellipsis">
                  {NotificationContext[notification.type].content}
                </h3>
                <span className="text-xs text-gray-500">
                  <TimeAgo date={notification.createdAt} />
                </span>
              </div>
              {notification.status === NotificationStatus.UNREAD && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-system"></div>
              )}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default NotificationList;
