
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Kiểm tra xem user có token không
  const token = localStorage.getItem('token');
  
  // Nếu không có token -> chưa đăng nhập -> chuyển hướng về trang Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Nếu có token -> đã đăng nhập -> cho phép render các route con bên trong
  return <Outlet />;
};

export default ProtectedRoute;
