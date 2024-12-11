import { NFile, UploadFilePayload } from "@/models/file.model";
import apiClient from "./config";

export const fileService = {
  upload: async (payload: UploadFilePayload) => {
    const formData = new FormData();
    formData.append('file', payload?.file, payload?.file?.name);
    formData.append('type', payload.type);

    const response = await apiClient.post<NFile>(
      `/files/upload`,
      formData
    );
    return response.data;
  },
};
