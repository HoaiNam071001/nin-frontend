"use client";

import { PageAble, PageInfo, SortOrder } from "@/models/utils.model";
import type { TableProps } from "antd";
import { Table } from "antd";
import type { ColumnType, TablePaginationConfig } from "antd/es/table";
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
      page: pagination.current - 1,
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
      scroll={{ x: "max-content", y: "calc(100% - 43px)" }}
      rowKey={(record, index) => `${index}`}
      className="h-full"
      onChange={onChangePage}
      pagination={
        pageInfo
          ? {
              current: pageInfo?.page + 1,
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
