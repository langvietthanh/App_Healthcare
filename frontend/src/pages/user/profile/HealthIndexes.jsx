/**
 * Tác dụng của file: Hiển thị các chỉ số sức khỏe nâng cao (BMI, BMR, TDEE)
 * File này dùng cho component cha nào là chính: Profile (src/pages/user/profile/index.jsx)
 */
import React from 'react';

const HealthIndexes = () => {
  return (
    <div className="px-8 mb-14">
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 flex justify-between items-center shadow-lg">
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-[#c8f31d] mb-1">20.1</p>
          <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">BMI</p>
          <p className="text-[10px] text-emerald-500 mt-1">Bình thường</p>
        </div>
        <div className="h-12 w-px bg-zinc-700"></div>
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-[#c8f31d] mb-1">1,450</p>
          <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">BMR</p>
          <p className="text-[10px] text-zinc-500 mt-1">kcal / ngày</p>
        </div>
        <div className="h-12 w-px bg-zinc-700"></div>
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-[#c8f31d] mb-1">2,200</p>
          <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">TDEE</p>
          <p className="text-[10px] text-zinc-500 mt-1">kcal / ngày</p>
        </div>
      </div>
    </div>
  );
};

export default HealthIndexes;
