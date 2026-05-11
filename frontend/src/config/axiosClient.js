import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Trỏ thẳng vào Backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Tự động đính kèm Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token; // Middleware auth của BE check x-auth-token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Tự động trích xuất data & Xử lý lỗi chung
axiosClient.interceptors.response.use(
  (response) => {
    // Chỉ trả về data từ response để dùng cho tiện
    return response.data;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    
    // Nếu lỗi 401 (Hết hạn token hoặc token sai) -> Tự động logout
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Uncomment dòng dưới nếu muốn tự động đá về trang login
      // window.location.href = '/login'; 
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
