import { DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import queryString from "query-string";

export interface List2Res<T> extends PageInfo {
  content: T[];
}

export interface DropdownOption<T> {
  name: string;
  value: T;
}

export interface PageInfo {
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface PageAble {
  size?: number; // Số phần tử mỗi trang
  page?: number; // Số trang hiện tại
  keyword?: string; //
  sort?: Array<OrderBy>;
}

export class PageAbleModel {
  stringify = stringifyPageAble
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface OrderBy {
  property?: string; // Thuộc tính cần sắp xếp
  direction: SortOrder; // Hướng sắp xếp
}  

export const stringifyPageAble  = (pageAble: PageAble): string => {
  const query = queryString.stringify(
    {
      size: pageAble?.size || DEFAULT_PAGESIZE,
      page: pageAble?.page || FIRST_PAGE,
      keyword: pageAble.keyword,
      sort: pageAble?.sort?.map((o) => `${o.property}:${o.direction}`),
    },
    { arrayFormat: "comma" } // Hoặc 'bracket' nếu cần [order=id:ASC, name:ASC]
  );
  return query;
}