import {
  SectionProgress,
  UpdateSectionProgressPayload,
} from "@/models/course/section-progress.model";
import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";
import apiClient from "../config";

export const sectionProgressService = {
  create: async (sectionId: number) => {
    const response = await apiClient.post<SectionProgress>(
      `/section-progress/${sectionId}`
    );
    return response.data;
  },

  update: async (sectionId: number, payload: UpdateSectionProgressPayload) => {
    const response = await apiClient.put<SectionProgress>(
      `/section-progress/${sectionId}`,
      payload
    );
    return response.data;
  },

  getBySection: async (sectionId: number) => {
    const response = await apiClient.get<SectionProgress>(
      `/section-progress/${sectionId}`
    );
    return response.data;
  },

  getByCourse: async (courseId: number) => {
    const response = await apiClient.get<SectionProgress[]>(
      `/section-progress/course/${courseId}`
    );
    return response.data;
  },

  getByUser: async (pageAble: PageAble) => {
    const response = await apiClient.get<List2Res<SectionProgress>>(
      `/section-progress/user?${stringifyPageAble(pageAble)}`
    );
    return response.data;
  },
};
