import { Topic } from "@/models";
import apiClient from "../config";
import { List2Res, PageAble, stringifyPageAble } from "@/models/utils.model";

export const topicService = {
  get: async (pageable: PageAble) => {
    const response = await apiClient.get<List2Res<Topic>>(
      `/topic?${stringifyPageAble(pageable)}`
    );
    return response.data;
  },
};
