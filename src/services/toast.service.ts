import { notification } from "antd";

// Hook sử dụng notification của Ant Design
export const toastService = {
  openNotification: ({
    title,
    message,
    type = "info",
    duration = 3,
    placement = "bottomRight",
  }: {
    title: string;
    message: string;
    type?: "info" | "success" | "error" | "warning";
    duration?: number;
    placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  }) => {
    notification[type]({
      message: title,
      description: message,
      showProgress: true,
      duration,
      placement,
    });
  },

  success: (message: string) => {
    toastService.openNotification({ title: "Success", message, type: "success" });
  },

  error: (message: string) => {
    toastService.openNotification({ title: "Error", message, type: "error" });
  },

  info: (message: string) => {
    toastService.openNotification({ title: "Info", message, type: "info" });
  },

  warning: (message: string) => {
    toastService.openNotification({ title: "Warning", message, type: "warning" });
  },
};
