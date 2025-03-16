import { Course, CoursePayload, FullCourse } from "@/models";
import apiClient from "../config";
import { List2Res, stringifyPageAble } from "@/models/utils.model";
import { PageAble } from "../../models/utils.model";
import queryString from "query-string";

export const courseSearchService = {
  getCourses: async (
    payload: CoursePayload,
    pageable: PageAble
  ): Promise<List2Res<Course>> => {
    const params = `${stringifyPageAble(pageable)}&${queryString.stringify(
      payload
    )}`;
    const response = await apiClient.get<List2Res<Course>>(
      `/course-search?${params}`
    );
    return response.data;
  },

  getSuggest: async (pageable: PageAble) => {
    const params = `${stringifyPageAble(pageable)}`;
    const response = await apiClient.get<Course[]>(
      `/course-search/suggest?${params}`
    );
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await apiClient.get<FullCourse>(`/course-search/full/${slug}`);
    return response.data;
  },

  getByInstructor: async (userId: number, pageAble?: PageAble) => {
    const response = await apiClient.get<List2Res<Course>>(
      `/course-search/instructor/${userId}?${pageAble ? stringifyPageAble(pageAble) : ""}`
    );
    return response.data;
  },
  
};
