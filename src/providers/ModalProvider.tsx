import React, { createContext, useContext, useState, ReactNode } from "react";
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;

interface ModalItemConfig {
  width?: string;
  height?: string;
}
interface ModalItem {
  content: ReactNode;
  header?: ReactNode | string;
  footer?: ReactNode;
  onClose?: () => void;
  onCancel?: () => void;
  onOk?: () => void;
  config?: ModalItemConfig;
}

interface ModalContextValue {
  openModal: (options: ModalItem) => void;
  openConfirm: (options: ModalItem) => void;
  closeModal: () => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalItem[]>([]);

  const openModal = (option: ModalItem) => {
    setModals((prev) => [...prev, option]);
  };

  const openConfirm = (options: ModalItem) => {
    confirm({
      title: options.header,
      icon: <ExclamationCircleFilled />,
      content: options.content,
      onOk() {
        options.onOk?.();
      },
      onCancel() {
        options.onCancel?.();
      },
    });
  };

  const closeModal = () => {
    setModals((prev) => {
      const lastModal = prev[prev.length - 1];
      if (lastModal?.onClose) {
        lastModal.onClose(); // Gọi callback khi modal đóng
      }
      return prev.slice(0, -1); // Loại bỏ modal cuối cùng
    });
  };

  const closeAllModals = () => {
    modals.forEach((modal) => {
      if (modal.onClose) {
        modal.onClose(); // Gọi callback cho tất cả modal
      }
    });
    setModals([]);
  };

  return (
    <ModalContext.Provider
      value={{ openConfirm, openModal, closeModal, closeAllModals }}
    >
      {children}
      {modals.map((modal, index) => (
        <Modal
          title={
            <div className="text-title-sm border-b border-stroke pb-2">{modal.header}</div>
          }
          key={index}
          open={true}
          onCancel={closeModal}
          footer={null}
          {...modal.config}
        >
          {modal.content}
          {modal.footer && (
            <div className="h-[30px] font-semibold">{modal.footer}</div>
          )}
        </Modal>
      ))}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
