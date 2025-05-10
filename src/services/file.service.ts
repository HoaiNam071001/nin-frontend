import {
  FileSearchPayload,
  NFile,
  UploadFilePayload,
} from "@/models/file.model";
import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";
import apiClient from "./config";

export const fileService = {
  upload: async (payload: UploadFilePayload) => {
    const formData = new FormData();
    formData.append("file", payload?.file, payload?.file?.name);
    formData.append("type", payload.type);
    if (payload.courseId) {
      formData.append("courseId", payload.courseId.toString());
    }

    const response = await apiClient.post<NFile>(`/files/upload`, formData);
    return response.data;
  },

  getList: async (paging: PageAble, payload: FileSearchPayload) => {
    const params = `${stringifyPageAble(paging)}`;

    const response = await apiClient.post<List2Res<NFile>>(
      `/files/list?${params}`,
      payload
    );
    return response.data;
  },
};
