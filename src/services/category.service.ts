import { Category } from "@/models";
import apiClient from "./config";
import { List2Res, Pageable, stringifyPageable } from "@/models/utils.model";

export const categoryService = {
  getRoot: async (pageable?: Pageable) => {
    const response = await apiClient.get<List2Res<Category>>(
      `/category?${stringifyPageable(pageable)}`
    );
    return response.data;
  },
  getChildren: async (parentId: number, pageable?: Pageable) => {
    const response = await apiClient.get<List2Res<Category>>(
      `/category/${parentId}?${stringifyPageable(pageable)}`
    );
    return response.data;
  },
};
