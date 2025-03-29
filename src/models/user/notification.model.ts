import { Course } from "../course";
import { User } from "./user.model";

export interface NotificationPayload {
  status: NotificationStatus;
}

export interface NotificationModel {
  id: number;
  type: NotificationType;
  sender?: User;
  user: User;
  createdAt: string;
  course?: Course;
  status: NotificationStatus;
  data?: NotificationMetadata;
}

export enum NotificationStatus {
  READ = "read",
  UNREAD = "unread",
}

export enum NotificationType {
  COURSE_APPROVED = "course_approved",
  COURSE_REJECTED = "course_rejected",
  COURSE_SUBSCRIPTION = "course_subscription",
  COURSE_REVIEWED = "course_reviewed",
  SYSTEM_ANNOUNCEMENT = "system_announcement",
}

export const NotificationContext = {
  [NotificationType.COURSE_APPROVED]: {
    title: "Course Approved",
    content: "Your course has been approved!",
  },
  [NotificationType.COURSE_REJECTED]: {
    title: "Course Rejected",
    content: "Your course has been rejected!",
  },
  [NotificationType.COURSE_SUBSCRIPTION]: {
    title: "Course Subscription",
    content: "Your course has been registered.",
  },
};

export type NotificationMetadata = {
  content?: string;
  subscriptionId?: number;
};
