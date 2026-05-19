/**
 * Tác dụng của file: Hiển thị các chỉ số đo lường cơ bản như Cân nặng, Chiều cao, Tuổi
 * File này dùng cho component cha nào là chính: Profile (src/pages/user/profile/index.jsx)
 */
import React from 'react';

const ProfileStats = ({ user }) => {
  // Tính tuổi động từ ngày sinh
  const age = user?.birthDate
    ? new Date().getFullYear() - new Date(user.birthDate).getFullYear()
    : '--';

  return (
    <div className="flex justify-center items-center gap-10 mb-8 px-6">
      <div className="text-center">
        <p className="text-3xl font-bold text-[#c8f31d] mb-1">
          {user?.physicalDetail?.weight || '--'} <span className="text-base text-white font-medium">kg</span>
        </p>
        <p className="text-xs text-zinc-400 font-medium">Cân nặng</p>
      </div>
      <div className="h-10 w-px bg-zinc-700"></div>
      <div className="text-center">
        <p className="text-3xl font-bold text-[#c8f31d] mb-1">
          {user?.physicalDetail?.height || '--'} <span className="text-base text-white font-medium">cm</span>
        </p>
        <p className="text-xs text-zinc-400 font-medium">Chiều cao</p>
      </div>
      <div className="h-10 w-px bg-zinc-700"></div>
      <div className="text-center">
        <p className="text-3xl font-bold text-[#c8f31d] mb-1">
          {age} <span className="text-base text-white font-medium">tuổi</span>
        </p>
        <p className="text-xs text-zinc-400 font-medium">Tuổi</p>
      </div>
    </div>
  );
};

export default ProfileStats;
