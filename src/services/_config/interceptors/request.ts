
const requestInterceptor = (config) => {
  // Xử lý trước khi gửi request (ví dụ: thêm token vào header)
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  console.log('Request Interceptor: ', config);
  return config;
};

const requestErrorInterceptor = (error) => {
  // Xử lý lỗi khi request không thành công
  console.error('Request Error: ', error);
  return Promise.reject(error);
};

export { requestInterceptor, requestErrorInterceptor };
