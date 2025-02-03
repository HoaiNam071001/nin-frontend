import { Course, CoursePayload, CourseStatusPayload } from "@/models";
import apiClient from "./config";
import { List2Res, stringifyPageAble } from "@/models/utils.model";
import { PageAble } from "../models/utils.model";

export const courseService = {
  create: async (data: CoursePayload) => {
    const response = await apiClient.post<Course>("/course", data);
    return response.data;
  },

  getMyCourses: async (pageable?: PageAble) => {
    const response = await apiClient.get<List2Res<Course>>(
      `/course?${pageable ? stringifyPageAble(pageable) : ''}`
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

  updateStatus: async (id: number, data: CourseStatusPayload) => {
    const response = await apiClient.put<Course>(`/course/${id}/status`, data);
    return response.data;
  },
};
