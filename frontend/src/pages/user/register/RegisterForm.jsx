/**
 * Tác dụng của file: Biểu mẫu nhập các trường thông tin đăng ký (Họ tên, SĐT, Email, Mật khẩu, Xác nhận mật khẩu có ẩn/hiện, xử lý submit form).
 * File này dùng cho component cha nào là chính: Register (src/pages/user/register/index.jsx)
 */
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm = ({
  fullName,
  setFullName,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Kiểm tra mật khẩu xác nhận chỉ khi người dùng đã bắt đầu nhập
  const confirmTouched = confirmPassword.length > 0;
  const passwordMismatch = confirmTouched && password !== confirmPassword;
  const passwordMatch = confirmTouched && password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return; // chặn submit nếu không khớp
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 flex-1">
      {/* Thông báo lỗi từ server */}
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
          placeholder="Nguyen Van A "
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
            placeholder="NguyenVanA@gmail.com"
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
            type={showPassword ? 'text' : 'password'}
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

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium mb-2">Xác nhận mật khẩu</label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            className={`w-full bg-transparent border rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none transition-colors pr-10 ${passwordMismatch
              ? 'border-red-500 focus:border-red-500'
              : passwordMatch
                ? 'border-green-500 focus:border-green-500'
                : 'border-gray-600 focus:border-[#c8f31d]'
              }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* Thông báo xác nhận mật khẩu real-time */}
        {passwordMismatch && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Mật khẩu xác nhận không khớp
          </p>
        )}
        {passwordMatch && (
          <p className="mt-1.5 text-xs text-green-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Mật khẩu khớp
          </p>
        )}
      </div>

      {/* Register Button */}
      <button
        type="submit"
        disabled={loading || passwordMismatch || !confirmPassword}
        className="w-full bg-[#c8f31d] text-black font-bold text-lg rounded-lg py-4 mt-6 hover:bg-[#b0d815] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Đang xử lý...' : 'Tạo Tài Khoản'}
      </button>
    </form>
  );
};

export default RegisterForm;
