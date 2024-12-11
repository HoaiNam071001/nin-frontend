import axios from 'axios';
import { requestInterceptor, requestErrorInterceptor } from './interceptors/request';
import { responseInterceptor, responseErrorInterceptor } from './interceptors/response';

// Tạo instance của axios
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // API base URL
  timeout: 10000, // Thời gian timeout, tùy chỉnh theo nhu cầu
});

// Tách riêng interceptor cho request
axiosInstance.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

// Tách riêng interceptor cho response
axiosInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

export default axiosInstance;
