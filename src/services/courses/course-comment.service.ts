import {
    CommentModel,
  CreateCommentPayload,
  GetCommentPayload,
} from "@/models/course/course-comment.model";
import apiClient from "../config";
import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";
import queryString from "query-string";

export const commentService = {
  create: async (courseId: number, payload: CreateCommentPayload) => {
    const response = await apiClient.post<CommentModel>(
      `/comments/course/${courseId}`,
      payload
    );
    return response.data;
  },

  find: async (
    courseId: number,
    payload: GetCommentPayload,
    pageAble?: PageAble
  ) => {
    const response = await apiClient.get<List2Res<CommentModel>>(
      `/comments/course/${courseId}?${stringifyPageAble(
        pageAble
      )}&${queryString.stringify(payload)}`
    );
    return response.data;
  },

  remove: async (commentId: number) => {
    await apiClient.delete(`/comments/${commentId}`);
  },
};
