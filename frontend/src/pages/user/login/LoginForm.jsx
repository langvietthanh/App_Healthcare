/**
 * Tác dụng của file: Biểu mẫu nhập Email và Mật khẩu (có tính năng ẩn/hiện mật khẩu, xử lý gửi đăng nhập lên server).
 * File này dùng cho component cha nào là chính: Login (src/pages/user/login/index.jsx)
 */
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6 flex-1">
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
            placeholder='NguyenVanA@gmail.com'
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
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='••••••••'
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
          <a href="#" className="text-[#c8f31d] text-sm font-medium hover:underline">
            Quên mật khẩu?
          </a>
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
    </form>
  );
};

export default LoginForm;
