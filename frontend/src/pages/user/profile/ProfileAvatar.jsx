/**
 * Tác dụng của file: Hiển thị ảnh đại diện (avatar) người dùng, tên và hạng thành viên
 * File này dùng cho component cha nào là chính: Profile (src/pages/user/profile/index.jsx)
 */
import React from 'react';

const ProfileAvatar = ({ user }) => {
  return (
    <div className="flex flex-col items-center mt-2 mb-12">
      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-transparent shadow-[0_0_30px_rgba(200,243,29,0.15)] mb-5">
        <img src={user?.imgURL || '/Avatar.png'} alt="Avatar" className="w-full h-full object-cover" />
      </div>
      <h2 className="text-3xl font-semibold mb-2">{user?.username || 'Loading...'}</h2>
      <p className="text-zinc-400 font-medium text-sm">{user?.role}</p>
    </div>
  );
};

export default ProfileAvatar;
