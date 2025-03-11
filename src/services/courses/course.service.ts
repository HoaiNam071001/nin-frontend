import {
  Course,
  CoursePayload,
  CourseStatusPayload,
  Discount,
  DiscountPayload,
  FullCourse,
  Instructor,
  InstructorPayload,
} from "@/models";
import apiClient from "../config";
import { List2Res, stringifyPageAble } from "@/models/utils.model";
import { PageAble } from "../../models/utils.model";

export const courseService = {
  create: async (data: CoursePayload) => {
    const response = await apiClient.post<Course>("/course", data);
    return response.data;
  },

  getInstructors: async (courseId: number) => {
    const response = await apiClient.get<Instructor[]>(
      `/course/instructor/${courseId}`
    );
    return response.data;
  },

  addInstructor: async (courseId: number, payload: InstructorPayload) => {
    const response = await apiClient.post<Instructor>(
      `/course/instructor/${courseId}`,
      payload
    );
    return response.data;
  },

  updateInstructor: async (id: number, payload: InstructorPayload) => {
    const response = await apiClient.put<Instructor>(
      `/course/instructor/${id}`,
      payload
    );
    return response.data;
  },

  removeInstructor: async (id: number) => {
    const response = await apiClient.delete(`/course/instructor/${id}`);
    return response.data;
  },
  
  getMyCourses: async (pageAble?: PageAble) => {
    const response = await apiClient.get<List2Res<Course>>(
      `/course?${pageAble ? stringifyPageAble(pageAble) : ""}`
    );
    return response.data;
  },

  getRegisteredCourses: async (pageAble?: PageAble) => {
    const response = await apiClient.get<List2Res<Course>>(
      `/course/registered?${pageAble ? stringifyPageAble(pageAble) : ""}`
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


  // Discounts:


  createDiscount: async (courseId: number, data: DiscountPayload) => {
    const response = await apiClient.post<Discount>(
      `/course/${courseId}/discounts`,
      data
    );
    return response.data;
  },

  updateDiscount: async (id: number, data: DiscountPayload) => {
    const response = await apiClient.put<Discount>(
      `/course/discounts/${id}`,
      data
    );
    return response.data;
  },

  deleteDiscount: async (id: number) => {
    const response = await apiClient.delete(`/course/discounts/${id}`);
    return response.data;
  },

  getDiscountById: async (id: number) => {
    const response = await apiClient.get<Discount>(`/course/discounts/${id}`);
    return response.data;
  },

  getDiscountsByCourseId: async (courseId: number) => {
    const response = await apiClient.get<Discount[]>(
      `/course/${courseId}/discounts`
    );
    return response.data;
  },

};
