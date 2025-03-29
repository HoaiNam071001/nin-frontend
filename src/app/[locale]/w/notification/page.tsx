"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import NotificationList from "@/components/Notification/NotificationList";
import { DATE_FORMATS, PARAMS, ROUTES } from "@/constants";
import { formatDate } from "@/helpers/date";
import useAuth from "@/hooks/useAuth";
import { useI18nRouter } from "@/hooks/useI18nRouter";
import {
  NotificationContext,
  NotificationModel,
  NotificationType,
} from "@/models/user/notification.model";
import { toastService } from "@/services/toast.service";
import { notificationsService } from "@/services/user/notification.service";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";
import CourseInfo from "./_components/CourseInfo";
import RejectionReason from "./_components/RejectionReason";
import SubscriberInfo from "./_components/SubscriberInfo";

const CoursePreview: React.FC = () => {
  const router = useI18nRouter();
  const { currentUser } = useAuth();
  const [notification, setNotification] = useState<NotificationModel | null>(
    null
  );
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<number>();

  const fetchNotification = async () => {
    const params = queryString.parse(searchParams.toString());
    const id = params[PARAMS.NOTIFICATION.ID];
    setSelectedId(+id);
    try {
      if (!id) {
        throw new Error("Notification ID is missing.");
      }
      const item: NotificationModel = await notificationsService.findOne(+id);
      setNotification(item);
    } catch (error) {
      toastService.error(error.message);
    }
  };

  useEffect(() => {
    if (currentUser && searchParams) {
      fetchNotification();
    }
  }, [currentUser, searchParams]);

  const handleNotificationClick = (notification: NotificationModel) => {
    router.push(
      `${ROUTES.NOTIFICATION}?${queryString.stringify({
        [PARAMS.NOTIFICATION.ID]: notification.id,
      })}`
    );
  };

  const getLayoutByNotification = () => {
    if (!notification) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading...</div>
        </div>
      );
    }

    const { type, course, sender, data, createdAt } = notification;
    const { title, content } = NotificationContext[type] || {
      title: "",
      content: "",
    };

    return (
      <div className="animate-fadeIn w-[90%] h-full bg-slate-50 border border-stroke p-6 rounded-xl shadow-lg">
        <div className="">
          <div className="text-secondary">
            {formatDate({
              date: createdAt,
              format: DATE_FORMATS.READABLE_DATE_TIME,
            })}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-1 text-slate-500">{content}</p>
          </div>
        </div>
        {(() => {
          switch (type) {
            case NotificationType.COURSE_APPROVED:
              return (
                <div className="">
                  <CourseInfo course={course} viewDetail={true} />
                </div>
              );

            case NotificationType.COURSE_REJECTED:
              return (
                <div className="">
                  {data && <RejectionReason data={data} />}
                  <CourseInfo course={course} viewSetting={true} />
                </div>
              );

            case NotificationType.COURSE_SUBSCRIPTION:
              return (
                <div className="">
                  {sender && <SubscriberInfo sender={sender} />}
                  <CourseInfo course={course} viewDetail={true} />
                </div>
              );

            default:
              return (
                <div className="p-6 rounded-xl shadow-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white">
                  <h2 className="text-2xl font-bold">Unknown Notification</h2>
                  <p className="mt-1 text-gray-100">
                    This notification type is not supported.
                  </p>
                </div>
              );
          }
        })()}
      </div>
    );
  };

  return (
    <DefaultLayout>
      <div className="h-full flex">
        <div className="w-[350px] h-full overflow-y-auto bg-white border border-stroke rounded-md shadow-lg z-10">
          <NotificationList
            selectedId={selectedId}
            onNotificationClick={handleNotificationClick}
          />
        </div>
        <div className="flex-1 flex justify-center items-center">
          {getLayoutByNotification()}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CoursePreview;
