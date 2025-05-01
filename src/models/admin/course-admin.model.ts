import { CourseStatus, Role } from "@/constants";
import { ChartCoursePayload } from "../course/course-subscription.model";

export interface DashboardSubPayload extends ChartCoursePayload {
  userIds: number[];
}

export interface UserCount {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  role: { [key in Role]: number };
}

export interface CourseCount {
  totalCourses: number;
  status: { [key in CourseStatus]: number };
}

export interface DashboardReport {
  users: UserCount;
  courses: CourseCount;
}
