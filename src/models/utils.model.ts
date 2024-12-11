import { DEFAULT_PAGESIZE, FIRST_PAGE } from "@/constants";
import queryString from "query-string";

export interface List2Res<T> extends PageInfo {
  content: T[];

}

export interface PageInfo {
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

export interface Pageable {
  size?: number; // Số phần tử mỗi trang
  page?: number; // Số trang hiện tại
  keyword?: string; //
  sort?: Array<OrderBy>;
}

export class PageableModel {
  stringify = stringifyPageable
}

export interface OrderBy {
  property?: string; // Thuộc tính cần sắp xếp
  direction: "ASC" | "DESC"; // Hướng sắp xếp
}  

export const stringifyPageable  = (pageable: Pageable): string => {
  const query = queryString.stringify(
    {
      size: pageable?.size || DEFAULT_PAGESIZE,
      page: pageable?.page || FIRST_PAGE,
      keyword: pageable.keyword,
      order: pageable?.sort?.map((o) => `${o.property}:${o.direction}`),
    },
    { arrayFormat: "comma" } // Hoặc 'bracket' nếu cần [order=id:ASC, name:ASC]
  );
  return query;
}