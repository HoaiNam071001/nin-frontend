import apiClient from "../config";
import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";
import queryString from "query-string";
import { DashboardSubPayload } from "@/models/admin/course-admin.model";
import {
  ChartCourseResponse,
  CourseSubscriptionFull,
} from "@/models/course/course-subscription.model";

export const courseAdminService = {
  getSubscriptionByCourse: async (
    payload: DashboardSubPayload,
    pageAble?: PageAble
  ) => {
    console.log(queryString.stringify(payload));
    const response = await apiClient.get<List2Res<CourseSubscriptionFull>>(
      `/dashboard/course-report?${
        queryString.stringify(payload) +
        "&" +
        (pageAble ? stringifyPageAble(pageAble) : "")
      }`
    );
    return response.data;
  },

  // chart
  getSubscriptionGroupByCourse: async (payload: DashboardSubPayload) => {
    const response = await apiClient.get<ChartCourseResponse>(
      `/dashboard/course-report/chart?${queryString.stringify(payload)}`
    );
    return response.data;
  },
};
