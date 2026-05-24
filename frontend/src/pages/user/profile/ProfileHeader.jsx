/**
 * Tác dụng của file: Hiển thị thanh tiêu đề Profile với nút quay lại và nút chỉnh sửa
 * File này dùng cho component cha nào là chính: Profile (src/pages/user/profile/index.jsx)
 */
import React from 'react';
import { ChevronLeft, Edit } from 'lucide-react';

const ProfileHeader = ({ onBack, onEdit }) => {
  return (
    <div className="flex justify-between items-center px-8 py-10">
      <button onClick={onBack} className="text-[#c8f31d] hover:text-[#aee018] transition-colors">
        <ChevronLeft size={32} strokeWidth={2.5} />
      </button>
      <h1 className="text-2xl font-bold tracking-wide">Profile</h1>
      <button onClick={onEdit} className="text-[#c8f31d] hover:text-[#aee018] transition-colors">
        <Edit size={26} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default ProfileHeader;
