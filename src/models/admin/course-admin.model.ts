import { ChartCoursePayload } from "../course/course-subscription.model";


export interface DashboardSubPayload extends ChartCoursePayload {
    userIds: number[];
  }