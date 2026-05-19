/**
 * Tác dụng của file: Hiển thị các chỉ số sức khỏe nâng cao (BMI, BMR, TDEE)
 * File này dùng cho component cha nào là chính: Profile (src/pages/user/profile/index.jsx)
 */
import React from 'react';

const HealthIndexes = ({ user }) => {
  const bmi = user?.physicalDetail?.bmi ? user.physicalDetail.bmi.toFixed(1) : '--';
  const bmr = user?.physicalDetail?.bmr ? Math.round(user.physicalDetail.bmr).toLocaleString() : '--';
  const tdee = user?.physicalDetail?.tdee ? Math.round(user.physicalDetail.tdee).toLocaleString() : '--';

  // Xác định phân loại BMI dựa trên tiêu chuẩn WHO
  const getBMICategory = (val) => {
    if (!val || val === '--') return 'Đang tính toán';
    const num = parseFloat(val);
    if (num < 18.5) return 'Thiếu cân ⚠️';
    if (num < 24.9) return 'Bình thường';
    if (num < 29.9) return 'Thừa cân ⚠️';
    return 'Béo phì 🚨';
  };

  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="px-8 mb-14">
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 flex justify-between items-center shadow-lg">
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-[#c8f31d] mb-1">{bmi}</p>
          <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">BMI</p>
          <p className={`text-[10px] mt-1 font-bold ${
            bmiCategory.includes('Bình thường') ? 'text-emerald-500' : 'text-amber-500'
          }`}>{bmiCategory}</p>
        </div>
        <div className="h-12 w-px bg-zinc-700"></div>
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-[#c8f31d] mb-1">{bmr}</p>
          <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">BMR</p>
          <p className="text-[10px] text-zinc-500 mt-1">kcal / ngày</p>
        </div>
        <div className="h-12 w-px bg-zinc-700"></div>
        <div className="text-center flex-1">
          <p className="text-2xl font-bold text-[#c8f31d] mb-1">{tdee}</p>
          <p className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">TDEE</p>
          <p className="text-[10px] text-zinc-500 mt-1">kcal / ngày</p>
        </div>
      </div>
    </div>
  );
};

export default HealthIndexes;
