import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import axiosClient from '../config/axiosClient';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
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
      <form onSubmit={handleLogin} className="space-y-6 flex-1">
        {/* Báo lỗi nếu có */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#c8f31d] focus:outline-none transition-colors"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c8f31d] opacity-0 focus-within:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-2">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:border-[#c8f31d] focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <div className="text-right mt-3">
            <a href="#" className="text-[#c8f31d] text-sm font-medium hover:underline">Quên mật khẩu?</a>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#c8f31d] text-black font-bold text-lg rounded-lg py-4 mt-4 hover:bg-[#b0d815] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>

        {/* Divider */}
        <div className="text-center text-gray-400 text-sm py-4">
          Hoặc Đăng nhập với
        </div>

      </form>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-gray-400 pb-4">
        Chưa có tài khoản? <Link to="/register" className="text-[#c8f31d] font-medium hover:underline">Đăng ký!</Link>
      </div>
    </div>
  );
};

export default Login;
