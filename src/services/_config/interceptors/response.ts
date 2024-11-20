const responseInterceptor = (response) => {
    // Xử lý sau khi nhận response từ server
    console.log('Response Interceptor: ', response);
    return response;
  };
  
  const responseErrorInterceptor = (error) => {
    // Xử lý lỗi khi response không thành công
    if (error.response && error.response.status === 401) {
      // Ví dụ: Nếu token hết hạn, chuyển hướng đến trang login
      console.error('Unauthorized! Redirecting to login...');
      // window.location.href = '/login';
    } else {
      console.error('Response Error: ', error);
    }
    return Promise.reject(error);
  };
  
  export { responseInterceptor, responseErrorInterceptor };
  