/**
 * Tác dụng của file: Hiển thị các nút đăng nhập liên kết mạng xã hội (Google, Facebook).
 * File này dùng cho component cha nào là chính: Login (src/pages/user/login/index.jsx)
 */
import React from 'react';

const SocialLogin = () => {
  return (
    <div className="space-y-4">
      {/* Divider */}
      <div className="text-center text-gray-400 text-sm py-4">
        Hoặc Đăng nhập với
      </div>

      <button
        type="button"
        className="w-full bg-white text-black font-medium rounded-lg py-3.5 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Kết nối với Google
      </button>
      <button
        type="button"
        className="w-full bg-[#4267B2] text-white font-medium rounded-lg py-3.5 flex items-center justify-center gap-3 hover:bg-[#365899] transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
        </svg>
        Kết nối với Facebook
      </button>
    </div>
  );
};

export default SocialLogin;
