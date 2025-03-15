import {
  Section,
  Video,
} from "@/models/course/section.model";
import apiClient from "../config";
import { getVideoDuration } from "@/helpers";

export const videoService = {
  addVideoSection: async (sectionId: number, file: File) => {
    try {
      const duration = await getVideoDuration(file); // Lấy duration từ file

      const formData = new FormData();
      formData.append("file", file, file?.name);
      formData.append("duration", Math.floor(duration).toString()); // Thêm duration vào formData

      const response = await apiClient.post<Video>(
        `/video/section/${sectionId}`,
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  removeFile: async (id: number) => {
    const response = await apiClient.delete(`/video/${id}`);
    return response.data;
  },
};
