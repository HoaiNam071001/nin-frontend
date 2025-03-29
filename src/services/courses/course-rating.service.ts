import apiClient from "../config";
import queryString from "query-string";

import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";
import {
  CourseRating,
  CreateCourseRatingDto,
  RatingStats,
  UpdateCourseRatingDto,
} from "@/models/course/course-rating.model";

export const courseRatingService = {
  // Tạo mới rating
  create: async (
    courseId: number,
    payload: CreateCourseRatingDto
  ): Promise<CourseRating> => {
    const response = await apiClient.post<CourseRating>(
      `/course-ratings/course/${courseId}`,
      payload
    );
    return response.data;
  },

  getByUser: async (courseId: number) => {
    const response = await apiClient.get<CourseRating>(
      `/course-ratings/course/${courseId}/user`
    );
    return response.data;
  },

  getByCourseSummary: async (courseId: number) => {
    const response = await apiClient.get<RatingStats>(
      `/course-ratings/course/${courseId}/summary`
    );
    return response.data;
  },

  // getReport: async (courseId: number) => {
  //   const response = await apiClient.get<RatingStats>(
  //     `/course-ratings/course/${courseId}/report`
  //   );
  //   return response.data;
  // },

  getByCourse: async (
    courseId: number,
    pageAble: PageAble,
    payload: { rating: number }
  ): Promise<List2Res<CourseRating>> => {
    const params = `${stringifyPageAble(pageAble)}&${queryString.stringify(
      payload
    )}`;
    const response = await apiClient.get<List2Res<CourseRating>>(
      `/course-ratings/course/${courseId}?${params}`
    );
    return response.data;
  },

  // Lấy chi tiết một rating
  getById: async (id: number): Promise<CourseRating> => {
    const response = await apiClient.get<CourseRating>(`/course-ratings/${id}`);
    return response.data;
  },

  // Cập nhật rating
  update: async (
    id: number,
    payload: UpdateCourseRatingDto
  ): Promise<CourseRating> => {
    const response = await apiClient.put<CourseRating>(
      `/course-ratings/${id}`,
      payload
    );
    return response.data;
  },

  // Xóa rating
  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/course-ratings/${id}`);
  },
};
