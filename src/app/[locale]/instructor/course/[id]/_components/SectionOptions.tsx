import NButton from "@/components/_commons/NButton";
import SvgIcon from "@/components/_commons/SvgIcon";
import { useModal } from "@/providers/ModalProvider";

export const SectionOptions = ({
  onRemove,
  onEdit,
  deleteMessage,
}: {
  onRemove: () => void;
  onEdit: () => void;
  deleteMessage?: string;
}) => {
  const { openConfirm } = useModal();

  const onConFirm = () => {
    openConfirm({
      header: "Delete",
      content: deleteMessage,
      onOk: () => onRemove(),
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <NButton
        variant="filled"
        color="red"
        className="!px-1"
        onClick={() => onConFirm()}
      >
        <SvgIcon className="icon icon-sm" icon="remove"></SvgIcon>
      </NButton>
      <NButton variant="filled" onClick={() => onEdit()} className="!px-1">
        <SvgIcon className="icon icon-sm" icon="edit"></SvgIcon>
      </NButton>
    </div>
  );
};
