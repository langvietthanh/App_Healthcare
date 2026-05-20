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
    </div>
  );
};

export default SocialLogin;
