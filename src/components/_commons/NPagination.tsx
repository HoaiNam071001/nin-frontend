"use client";

import { PageAble, PageInfo } from "@/models/utils.model";
import { Pagination } from "antd";

interface NPaginationProps {
  pageInfo?: PageInfo;
  updated?: (pageAble: PageAble) => void;
}

const NPagination = ({ pageInfo, updated, ...rest }: NPaginationProps) => {
  const onChangePage = (page: number, pageSize: number) => {
    const pageAble: PageAble = {
      page: page - 1,
      size: pageSize,
    };
    updated?.(pageAble);
  };

  return (
    <>
      {pageInfo?.totalElements > 0 && (
        <Pagination
          total={pageInfo?.totalElements}
          current={pageInfo?.page + 1}
          pageSize={pageInfo?.size}
          onChange={onChangePage}
          align="end"
          {...rest}
        />
      )}
    </>
  );
};

export default NPagination;
