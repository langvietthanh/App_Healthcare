/**
 * Tác dụng của file: Hiển thị các chỉ số đo lường cơ bản như Cân nặng, Chiều cao, Tuổi
 * File này dùng cho component cha nào là chính: Profile (src/pages/user/profile/index.jsx)
 */
import React from 'react';

const ProfileStats = () => {
  return (
    <div className="flex justify-center items-center gap-10 mb-8 px-6">
      <div className="text-center">
        <p className="text-3xl font-bold text-[#c8f31d] mb-1">
          58 <span className="text-base text-white font-medium">kg</span>
        </p>
        <p className="text-xs text-zinc-400 font-medium">Weight</p>
      </div>
      <div className="h-10 w-px bg-zinc-700"></div>
      <div className="text-center">
        <p className="text-3xl font-bold text-[#c8f31d] mb-1">
          170 <span className="text-base text-white font-medium">cm</span>
        </p>
        <p className="text-xs text-zinc-400 font-medium">Height</p>
      </div>
      <div className="h-10 w-px bg-zinc-700"></div>
      <div className="text-center">
        <p className="text-3xl font-bold text-[#c8f31d] mb-1">
          24 <span className="text-base text-white font-medium">year</span>
        </p>
        <p className="text-xs text-zinc-400 font-medium">Age</p>
      </div>
    </div>
  );
};

export default ProfileStats;
