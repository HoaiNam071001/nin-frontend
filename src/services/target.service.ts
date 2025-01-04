import { CourseTarget, CourseTargetPayload } from "@/models";
import apiClient from "./config";

export const targetService = {
  getByCourse: async (id: number) => {
    const response = await apiClient.get<CourseTarget[]>(`/target/${id}`);
    return response.data;
  },

  update: async (id: number, payload: CourseTargetPayload) => {
    const response = await apiClient.put<CourseTarget[]>(
      `/target/${id}`,
      payload
    );
    return response.data;
  },
};
