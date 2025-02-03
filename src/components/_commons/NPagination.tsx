"use client";

import React from "react";
import { Pagination } from "antd";
import { PageAble, PageInfo } from "@/models/utils.model";

interface NPaginationProps {
  pageInfo?: PageInfo;
  updated?: (pageAble: PageAble) => void;
}

const NPagination = ({ pageInfo, updated, ...rest }: NPaginationProps) => {
  const onChangePage = (page: number, pageSize: number) => {
    const pageAble: PageAble = {
      page: page,
      size: pageSize,
    };
    updated?.(pageAble);
  };

  return (
    <>
      {pageInfo?.totalElements && (
        <Pagination
          defaultCurrent={1}
          total={pageInfo?.totalElements}
          current={pageInfo?.page}
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
