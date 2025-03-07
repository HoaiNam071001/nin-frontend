import {
  Post,
  PostPayload,
} from "@/models/course/section.model";
import apiClient from "../config";

export const postService = {
  addPostSection: async (sectionId: number, payload: PostPayload) => {
    const response = await apiClient.post<Post>(
      `/post/section/${sectionId}`,
      payload
    );
    return response.data;
  },


  // removeFile: async (id: number) => {
  //   const response = await apiClient.delete(`/post/${id}`);
  //   return response.data;
  // },
};
