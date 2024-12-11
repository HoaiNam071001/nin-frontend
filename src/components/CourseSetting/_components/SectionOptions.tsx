import NModal from "@/components/_commons/NModal";
import SvgIcon from "@/components/_commons/SvgIcon";
import { Dropdown, MenuProps } from "antd";
import { useState } from "react";

export const SectionOptions = ({
  onRemove,
  onEdit,
}: {
  onRemove: () => void;
  onEdit: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: 'edit',
      label: (
        <div className="flex space-x-2 items-center">
          <SvgIcon className="icon icon-sm" icon="edit"></SvgIcon>
          <span>Edit</span>
        </div>
      ),
      onClick: () => onEdit(),
    },
    {
      key: 'remove',
      label: (
        <div className="flex space-x-2 items-center">
          <SvgIcon className="icon icon-sm" icon="remove"></SvgIcon>
          <span>Remove</span>
        </div>
      ),
      onClick: () => setOpen(true),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} placement="bottomRight" trigger={["click"]}>
        <div className="cursor-pointer hover:bg-slate-300 py-1 rounded-sm">
          <SvgIcon className="icon icon-sm" icon="3dot_vert"></SvgIcon>
        </div>
      </Dropdown>

      <NModal
        title="Title"
        content={"Are you sure to delete this Section?"}
        onOk={() => {
          onRemove?.(), setOpen(false);
        }}
        isOpen={open}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};
