import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import axiosClient from '../config/axiosClient';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Khai báo state cho form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Vì API yêu cầu thêm các trường bodymetric nên ta gửi giá trị mặc định tạm thời.
      // Khi nào có Frame nhập Bodymetric, ta sẽ đổi sau.
      const payload = {
        username: fullName,
        email: email,
        password: password,
        phone: phone, // Gửi kèm số điện thoại
        // --- Giá trị giả định để tránh bị lỗi 400 Bad Request từ server ---
        height: 170,
        weight: 60,
        gender: 'male',
        birthDate: '2000-01-01'
      };

      await axiosClient.post('/auth/register', payload);

      // Đăng ký thành công -> Tự động gọi API Đăng nhập để lấy Token
      const loginResponse = await axiosClient.post('/auth/login', {
        email: email,
        password: password
      });

      const token = loginResponse.token || loginResponse.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }

      // Chuyển thẳng sang trang điền BodyMetric (Onboarding)
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-8 flex flex-col relative font-sans">
      {/* Nút Back */}
      <div className="mb-6 mt-4">
        <button onClick={() => navigate(-1)} className="text-[#c8f31d] hover:text-[#aee018]">
          <ChevronLeft size={32} />
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Tạo Tài Khoản</h1>
        <p className="text-gray-400 text-sm">Nhập thông tin của bạn để bắt đầu</p>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-5 flex-1">
        {/* Thông báo lỗi */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Họ và tên</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="LangThanh Patel"
            className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:border-[#c8f31d] focus:outline-none transition-colors"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">Số điện thoại</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+84 987 654 321"
            className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:border-[#c8f31d] focus:outline-none transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="LangThanh@Example.Com"
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:border-[#c8f31d] focus:outline-none transition-colors"
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
              placeholder="••••••••"
              className="w-full bg-transparent border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:border-[#c8f31d] focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#c8f31d] text-black font-bold text-lg rounded-lg py-4 mt-6 hover:bg-[#b0d815] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Tạo Tài Khoản'}
        </button>

        {/* Divider */}
        <div className="text-center text-gray-400 text-sm py-3">
          Hoặc Đăng ký với
        </div>

        {/* Social Login */}
        <div className="space-y-4 pb-6">
          <button type="button" className="w-full bg-white text-black font-medium rounded-lg py-3.5 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Kết nối với Google
          </button>
          <button type="button" className="w-full bg-[#4267B2] text-white font-medium rounded-lg py-3.5 flex items-center justify-center gap-3 hover:bg-[#365899] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
            </svg>
            Kết nối với Facebook
          </button>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center mt-2 text-sm text-gray-400 pb-4">
        Đã có tài khoản? <Link to="/login" className="text-[#c8f31d] font-medium hover:underline">Đăng nhập!</Link>
      </div>
    </div>
  );
};

export default Register;
