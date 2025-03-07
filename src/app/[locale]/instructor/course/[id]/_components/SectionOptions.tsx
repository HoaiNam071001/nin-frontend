import NDropdown from "@/components/_commons/NDropdown";
import NModal from "@/components/_commons/NModal";
import SvgIcon from "@/components/_commons/SvgIcon";
import { useState } from "react";

export const SectionOptions = ({
  onRemove,
  onEdit,
}: {
  onRemove: () => void;
  onEdit: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const items = [
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
      <NDropdown items={items} />

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
