/**
 * Tác dụng của file: Màn hình lựa chọn mức độ thể lực hiện tại dạng card grid.
 * File này dùng cho component cha nào là chính: Onboarding (src/pages/user/onboarding/index.jsx)
 */
import React from 'react';

const StepFitnessLevel = ({ fitnessLevel, setFitnessLevel, onNext, onPrev }) => {
  const levels = [
    { 
      id: 'Mới bắt đầu', 
      label: 'MỚI BẮT ĐẦU', 
      icon: '⚡',
      desc: 'Ít vận động hoặc chưa từng tập. Cần lộ trình nhẹ nhàng để làm quen.'
    },
    { 
      id: 'Trung bình', 
      label: 'TRUNG BÌNH', 
      icon: '🔥',
      desc: 'Đã có thói quen tập luyện cơ bản, muốn cải thiện thể lực và sức bền.'
    },
    { 
      id: 'Nâng cao', 
      label: 'NÂNG CAO', 
      icon: '🏆',
      desc: 'Thường xuyên tập cường độ cao. Sẵn sàng thử thách giới hạn mới.'
    },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-center text-white">Mức độ thể lực?</h2>
      <p className="text-zinc-500 text-sm mb-8 text-center">Chọn mức độ phù hợp nhất với trạng thái thể chất hiện tại của bạn.</p>

      {/* Card Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
        {levels.map((lvl) => {
          const isSelected = fitnessLevel === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setFitnessLevel(lvl.id)}
              className={`flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 active:scale-98 relative overflow-hidden ${
                isSelected
                  ? 'bg-zinc-900 border-[#c8f31d] shadow-[0_4px_20px_rgba(200,243,29,0.15)] text-white'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
              }`}
            >
              {/* Highlight bar for selected card */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c8f31d] to-[#aee018]"></div>
              )}
              
              <span className={`text-4xl mb-4 block transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                {lvl.icon}
              </span>
              
              <h3 className={`font-black text-sm tracking-wider mb-2 ${isSelected ? 'text-[#c8f31d]' : 'text-white'}`}>
                {lvl.label}
              </h3>
              
              <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                {lvl.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Navigation Buttons directly below grid */}
      <div className="flex gap-4 w-full max-w-sm mt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 py-4 rounded-xl text-base font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition-all"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 py-4 rounded-xl text-base font-bold bg-[#c8f31d] text-black hover:bg-[#b0d815] transition-all shadow-[0_4px_14px_rgba(200,243,29,0.35)]"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default StepFitnessLevel;
