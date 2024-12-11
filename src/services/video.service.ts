import {
  Section,
  Video,
} from "@/models/course/section.model";
import apiClient from "./config";

export const videoService = {
  addVideoSection: async (sectionId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file, file?.name);
    const response = await apiClient.post<Video>(
      `/video/section/${sectionId}`,
      formData
    );
    return response.data;
  },


  removeFile: async (id: number) => {
    const response = await apiClient.delete(`/video/${id}`);
    return response.data;
  },
};
