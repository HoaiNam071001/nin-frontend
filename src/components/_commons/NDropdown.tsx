"use client";

import React from "react";
import SvgIcon from "./SvgIcon";
import { Dropdown } from "antd";
import { ItemType } from "antd/es/menu/interface";

type DropdownProps<T> = {
  items: ItemType[];
};

const NDropdown = <T extends object>({ items }: DropdownProps<T>) => {
  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
      <div className="cursor-pointer hover:bg-slate-300 py-1 rounded-sm">
        <SvgIcon className="icon icon-sm" icon="3dot_vert"></SvgIcon>
      </div>
    </Dropdown>
  );
};

export default NDropdown;
