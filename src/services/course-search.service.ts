import { Course, EduCoursePayload } from "@/models";
import apiClient from "./config";
import { List2Res, stringifyPageAble } from "@/models/utils.model";
import { PageAble } from "../models/utils.model";
import queryString from "query-string";

export const courseSearchService = {

  getCourses: async (payload: EduCoursePayload, pageable: PageAble): Promise<List2Res<Course>> => {
   const params = `${stringifyPageAble(pageable)}&${queryString.stringify(payload)}`;
    const response = await apiClient.get<List2Res<Course>>(
      `/course-search?${params}`
    );
    return response.data;
  },
};
