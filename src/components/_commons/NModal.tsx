// components/ModalComponent.tsx
import React from "react";
import { Modal } from "antd";

interface NModalProps {
  title: string;
  content: string;
  onOk: () => void;
  onCancel: () => void;
  isOpen: boolean;
  confirmLoading?: boolean;
}

const NModal: React.FC<NModalProps> = ({
  title,
  content,
  onOk,
  onCancel,
  isOpen,
  confirmLoading = false,
}) => {
  return (
    <Modal
      title={title}
      open={isOpen}
      onOk={onOk}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      <p>{content}</p>
    </Modal>
  );
};

export default NModal;
