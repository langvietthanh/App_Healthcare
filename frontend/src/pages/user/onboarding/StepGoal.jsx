/**
 * Tác dụng của file: Màn hình lựa chọn mục tiêu sức khỏe (Giảm cân, Tăng cơ, Cải thiện thể lực).
 * File này dùng cho component cha nào là chính: Onboarding (src/pages/user/onboarding/index.jsx)
 */
import React from 'react';

const StepGoal = ({ goal, setGoal, onNext }) => {
  const goals = [
    { id: 'Giảm cân', label: 'Giảm Cân', icon: '⚖️' },
    { id: 'Tăng cơ', label: 'Tăng Cơ', icon: '💪' },
    { id: 'Cải thiện thể lực', label: 'Cải Thiện Thể Lực', icon: '🏋️' },
  ];

  return (
    <div className="flex flex-col flex-1 items-center w-full px-6">
      <h2 className="text-3xl font-bold mb-10 text-center text-white">Mục tiêu của bạn?</h2>

      <div className="w-full space-y-4">
        {goals.map((g) => (
          <button
            key={g.id}
            onClick={() => setGoal(g.id)}
            className={`w-full py-5 px-6 rounded-xl font-bold text-lg transition-all border flex items-center justify-center gap-3 ${
              goal === g.id
                ? 'bg-[#c8f31d] text-black border-[#c8f31d]'
                : 'bg-transparent text-white border-zinc-700 hover:border-[#c8f31d]'
            }`}
          >
            <span>{g.icon}</span>
            {g.label}
          </button>
        ))}
      </div>

      <div className="w-full mt-auto pb-8">
        <button
          onClick={onNext}
          className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#b0d815] transition-all"
        >
          Hoàn tất
        </button>
      </div>
    </div>
  );
};

export default StepGoal;
