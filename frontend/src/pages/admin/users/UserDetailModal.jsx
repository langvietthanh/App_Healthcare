/**
 * Tác dụng của file: Hộp thoại pop-up hiển thị chi tiết đầy đủ hồ sơ chỉ số cơ thể và mục tiêu tập luyện của người dùng được chọn.
 * File này dùng cho component cha nào là chính: AdminUsers (src/pages/admin/users/index.jsx)
 */
import React from 'react';

const goalLabel = {
  'lose_weight': 'Giảm cân',
  'balance': 'Cân bằng',
  'gain_muscle': 'Tăng cơ'
};

const genderLabel = {
  'male': 'Nam',
  'female': 'Nữ'
};

const activityLabel = {
  'sedentary': 'Ít vận động',
  'light': 'Nhẹ nhàng',
  'moderate': 'Vừa phải',
  'active': 'Năng động',
  'very_active': 'Rất năng động'
};

const getBmiStatus = (bmi) => {
  if (!bmi) return { label: 'N/A', color: 'text-zinc-500' };
  if (bmi < 18.5) return { label: 'Thiếu cân', color: 'text-blue-400' };
  if (bmi < 25) return { label: 'Bình thường', color: 'text-green-400' };
  if (bmi < 30) return { label: 'Thừa cân', color: 'text-orange-400' };
  return { label: 'Béo phì', color: 'text-red-500' };
};

const calculateAge = (birthDate) => {
  if (!birthDate) return '?';
  const diff = Date.now() - new Date(birthDate).getTime();
  const age = new Date(diff); 
  return Math.abs(age.getUTCFullYear() - 1970);
};

const UserDetailModal = ({ user, onClose }) => {
  const pd = user.physicalDetail || {};
  const goals = user.goals || {};
  const age = calculateAge(user.birthDate);
  const bmiStatus = getBmiStatus(pd.bmi);
  const adviceText = goals.weightAdvice?.advice || 'Không có dữ liệu tư vấn cho người dùng này.';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl font-black text-[#c8f31d]">
            {user.username.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">{user.username}</h2>
            <p className="text-zinc-500">{user.email}</p>
          </div>
        </div>

        {/* Content Section (2 columns) */}
        <div className="flex flex-col md:flex-row gap-8 overflow-y-auto pr-2">
          
          {/* Left Column: Physical & Energy */}
          <div className="flex-1 space-y-4">
            <h3 className="text-[#c8f31d] font-bold uppercase tracking-wider text-xs mb-4">Chỉ số hình thể & Năng lượng</h3>
            
            <div className="bg-zinc-800/30 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                <span className="text-zinc-400 text-sm">Tuổi / Giới tính</span>
                <span className="text-white font-semibold">{age} tuổi / {genderLabel[pd.gender] || 'Khác'}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                <span className="text-zinc-400 text-sm">Mức độ vận động</span>
                <span className="text-white font-semibold">{activityLabel[pd.activityLevel] || 'N/A'}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                <span className="text-zinc-400 text-sm">Chỉ số BMI</span>
                <span className="text-white font-semibold">
                  {pd.bmi ? pd.bmi.toFixed(1) : '-'} <span className={`ml-1 ${bmiStatus.color}`}>({bmiStatus.label})</span>
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-zinc-400 text-sm">BMR / TDEE</span>
                <span className="text-white font-semibold">
                  {pd.bmr ? Math.round(pd.bmr) : '-'} kcal <span className="text-zinc-600 mx-1">/</span> {pd.tdee ? Math.round(pd.tdee) : '-'} kcal
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-zinc-800/50 self-stretch"></div>

          {/* Right Column: Goals & Nutrition */}
          <div className="flex-1 space-y-4">
            <h3 className="text-[#c8f31d] font-bold uppercase tracking-wider text-xs mb-4">Mục tiêu & Chế độ ăn</h3>
            
            <div className="bg-zinc-800/30 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                <span className="text-zinc-400 text-sm">Mục tiêu chính</span>
                <span className="text-white font-semibold text-[#c8f31d] bg-[#c8f31d]/10 px-3 py-1 rounded-full text-sm">
                  {goalLabel[goals.goal] || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                <span className="text-zinc-400 text-sm">Cân nặng mục tiêu</span>
                <span className="text-white font-semibold">{goals.weightGoal ? `${goals.weightGoal} kg` : '-'}</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                <span className="text-zinc-400 text-sm">Lượng calo hằng ngày</span>
                <span className="text-white font-semibold">{goals.dailyCalories ? `${Math.round(goals.dailyCalories)} kcal` : '-'}</span>
              </div>

              <div className="pt-2">
                <span className="text-zinc-400 text-sm block mb-2">Lời khuyên hệ thống</span>
                <div className="bg-zinc-900/50 rounded-xl p-3 border border-zinc-800/50">
                  <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {adviceText}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-3.5 rounded-2xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 hover:text-white transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default UserDetailModal;
