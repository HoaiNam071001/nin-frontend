import { Topic } from "@/models";
import apiClient from "./config";
import { List2Res, Pageable, stringifyPageable } from "@/models/utils.model";

export const topicService = {
  get: async (pageable: Pageable) => {
    const response = await apiClient.get<List2Res<Topic>>(
      `/topic?${stringifyPageable(pageable)}`
    );
    return response.data;
  },
};
