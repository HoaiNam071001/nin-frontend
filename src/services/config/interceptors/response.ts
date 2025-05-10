import { AxiosError, AxiosResponse } from "axios";

const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

const responseErrorInterceptor = (error: AxiosError) => {
  // Xử lý lỗi khi response không thành công
  if (error.response && error.response.status === 401) {
    // Ví dụ: Nếu token hết hạn, chuyển hướng đến trang login
    // window.location.href = '/login';
  } else {
  }
  return Promise.reject(error.response.data);
};

export { responseErrorInterceptor, responseInterceptor };
