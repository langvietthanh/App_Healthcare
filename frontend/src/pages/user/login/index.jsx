/**
 * Tác dụng của file: Điều phối chính quản lý State nhập email/password, gửi yêu cầu đăng nhập, lưu token/role vào localStorage và chuyển trang.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/user/index.js)
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import axiosClient from '../../../config/axiosClient';
import LoginForm from './LoginForm';
import SocialLogin from './SocialLogin';

const Login = () => {
  const [email, setEmail] = useState('LangThanh@Example.Com');
  const [password, setPassword] = useState('12345678');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Bước 1: Đăng nhập lấy token
      const response = await axiosClient.post('/auth/login', { email, password });
      const token = response.token || response.data?.token;

      if (!token) throw new Error('Không nhận được token');
      localStorage.setItem('token', token);

      // Bước 2: Gọi /auth/me để lấy thông tin role
      const meRes = await axiosClient.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const role = meRes.role || meRes.data?.role || 'user';
      localStorage.setItem('role', role);

      // Bước 3: Redirect theo role
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-8 flex flex-col relative font-sans">
      {/* Nút Back */}
      <div className="mb-8 mt-4">
        <Link to="/" className="text-[#c8f31d] hover:text-[#aee018] inline-block">
          <ChevronLeft size={32} />
        </Link>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">
          Chào mừng đến <span className="text-[#c8f31d]">HealthSync</span>
        </h1>
        <p className="text-gray-400 text-sm">Vui lòng đăng nhập để tiếp tục</p>
      </div>

      {/* Form */}
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        loading={loading}
        onSubmit={handleLogin}
      />

      {/* Social Login */}
      <SocialLogin />

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-400 pb-4">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-[#c8f31d] font-medium hover:underline">
          Đăng ký!
        </Link>
      </div>
    </div>
  );
};

export default Login;
