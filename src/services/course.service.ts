import { Course, CoursePayload } from "@/models";
import apiClient from "./config";
import { List2Res, stringifyPageable } from "@/models/utils.model";
import { Pageable } from "../models/utils.model";

export const courseService = {
  create: async (data: CoursePayload) => {
    const response = await apiClient.post<Course>("/course", data);
    return response.data;
  },

  getMyCourses: async (pageable: Pageable) => {
    const response = await apiClient.get<List2Res<Course>>(
      `/course?${stringifyPageable(pageable)}`
    );
    return response.data;
  },

  getCourseById: async (id: number) => {
    const response = await apiClient.get<Course>(`/course/${id}`);
    return response.data;
  },

  update: async (id: number, data: CoursePayload) => {
    const response = await apiClient.put<Course>(`/course/${id}`, data);
    return response.data;
  },
};
