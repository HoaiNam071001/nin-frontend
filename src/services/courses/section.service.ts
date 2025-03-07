import {
  Section,
  CreateSectionPayload,
  UpdateSectionPayload,
  SectionContent,
} from "@/models/course/section.model";
import apiClient from "../config";
import { NFile } from "@/models/file.model";

export const sectionService = {
  create: async (data: CreateSectionPayload) => {
    const response = await apiClient.post<Section>("/section", data);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<Section>(`/section/${id}`);
    return response.data;
  },

  getContent: async (id: number) => {
    const response = await apiClient.get<SectionContent>(`/section/content/${id}`);
    return response.data;
  },

  addFile: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file, file?.name);
    const response = await apiClient.post<NFile>(`/section/${id}/add-file`, formData);
    return response.data;
  },

  removeFile: async (id: number) => {
    const response = await apiClient.delete(`/section/remove-file/${id}`);
    return response.data;
  },

  update: async (id: number, payload: UpdateSectionPayload) => {
    const response = await apiClient.put<Section>(`/section/${id}`, payload);
    return response.data;
  },

  remove: async (id: number) => {
    const response = await apiClient.delete(`/section/${id}`);
    return response.data;
  },

  getByCourse: async (courseId: number) => {
    const response = await apiClient.get<Section[]>(
      `/section/course/${courseId}`
    );
    return response.data;
  },
};
