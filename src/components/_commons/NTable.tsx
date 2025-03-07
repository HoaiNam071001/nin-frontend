"use client";

import React from "react";
import { Table } from "antd";
import type { TableProps } from "antd";
import type { ColumnType, TablePaginationConfig } from "antd/es/table";
import { PageAble, PageInfo, SortOrder } from "@/models/utils.model";
import { FilterValue, SorterResult } from "antd/es/table/interface";

export type TableColumn<T> = ColumnType<T>;

export type TableColumns<T> = Array<TableColumn<T>>;
interface NTableProps<T> extends TableProps<T> {
  columns: TableColumns<T>;
  dataSource: T[];
  pageInfo?: PageInfo;
  updated?: (pageAble: PageAble) => void;
}

const NTable = <T extends object>({
  columns,
  dataSource,
  pageInfo,
  updated,
  ...rest
}: NTableProps<T>) => {
  // const { styles } = useStyle();
  const onChangePage = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T>
  ) => {
    const pageAble: PageAble = {
      page: pagination.current,
      size: pagination.pageSize,
      sort: sorter?.field
        ? [
            {
              property: sorter.field as string,
              direction:
                sorter.order === "ascend" ? SortOrder.ASC : SortOrder.DESC,
            },
          ]
        : undefined,
    };
    updated?.(pageAble);
  };

  return (
    <Table<T>
      bordered
      // className={styles.customTable}
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: "max-content" }}
      rowKey={(record, index) => `${index}`}
      onChange={onChangePage}
      pagination={
        pageInfo
          ? {
              current: pageInfo?.page,
              pageSize: pageInfo?.size,
              total: pageInfo?.totalElements,
              showSizeChanger: true,
            }
          : false
      }
      {...rest}
    />
  );
};

export default NTable;
