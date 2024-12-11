import { StorageKey } from "@/constants";
import store, { RootState } from "@/redux/store";

const requestInterceptor = (config) => {
  // Xử lý trước khi gửi request (ví dụ: thêm token vào header)
  const token =
    (store.getState() as RootState).auth.token ||
    localStorage.getItem(StorageKey.AUTH_TOKEN);

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

const requestErrorInterceptor = (error) => {
  // Xử lý lỗi khi request không thành công
  return Promise.reject(error);
};

export { requestInterceptor, requestErrorInterceptor };
