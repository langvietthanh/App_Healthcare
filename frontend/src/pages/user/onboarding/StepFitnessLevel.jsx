/**
 * Tác dụng của file: Màn hình lựa chọn mức độ thể lực hiện tại (Mới bắt đầu, Trung bình, Nâng cao).
 * File này dùng cho component cha nào là chính: Onboarding (src/pages/user/onboarding/index.jsx)
 */
import React from 'react';

const StepFitnessLevel = ({ fitnessLevel, setFitnessLevel, onNext }) => {
  const levels = [
    { id: 'Mới bắt đầu', label: 'MỚI BẮT ĐẦU' },
    { id: 'Trung bình', label: 'TRUNG BÌNH' },
    { id: 'Nâng cao', label: 'NÂNG CAO' },
  ];

  return (
    <div className="flex flex-col flex-1 items-center w-full px-6">
      <h2 className="text-3xl font-bold mb-10 text-center text-white">Mức độ thể lực?</h2>

      <div className="w-full space-y-4">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => setFitnessLevel(lvl.id)}
            className={`w-full py-5 rounded-xl font-bold text-lg transition-all border ${
              fitnessLevel === lvl.id
                ? 'bg-[#c8f31d] text-black border-[#c8f31d]'
                : 'bg-transparent text-white border-zinc-700 hover:border-[#c8f31d]'
            }`}
          >
            {lvl.label}
          </button>
        ))}
      </div>

      <div className="w-full mt-auto pb-8">
        <button
          onClick={onNext}
          className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#b0d815] transition-all"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default StepFitnessLevel;
