import { CourseProgress } from "@/models/course/course-progress.model";
import { List2Res, PageAble } from "@/models/utils.model";
import apiClient from "../config";

export const courseProgressService = {
  get: async (pageAble: PageAble) => {
    const response = await apiClient.get<List2Res<CourseProgress>>(
      `/course-progress`
    );
    return response.data;
  },
};
