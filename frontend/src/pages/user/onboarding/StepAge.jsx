/**
 * Tác dụng của file: Màn hình nhập tuổi bằng cách nhập số trực tiếp hoặc dùng stepper tăng/giảm.
 * File này dùng cho component cha nào là chính: Onboarding (src/pages/user/onboarding/index.jsx)
 */
import React from 'react';

const StepAge = ({ age, setAge, onNext, onPrev }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-center text-white">Bạn bao nhiêu tuổi?</h2>
      <p className="text-zinc-500 text-sm mb-6 text-center">Chúng tôi dùng tuổi của bạn để thiết lập kế hoạch tập luyện phù hợp.</p>

      {/* Modern Stepper + Direct Input */}
      <div className="flex items-center justify-center gap-6 my-6 w-full bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/60 shadow-inner">
        <button
          type="button"
          onClick={() => setAge(Math.max(1, age - 1))}
          className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-2xl flex items-center justify-center border border-zinc-705 hover:border-zinc-500 transition-all active:scale-95 shadow-md"
        >
          -
        </button>
        <div className="relative flex flex-col items-center justify-center py-2">
          <input
            type="number"
            value={age}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) setAge(val);
            }}
            className="w-24 text-center text-5xl font-black bg-transparent text-[#c8f31d] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="1"
            max="120"
          />
          <span className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mt-1">tuổi</span>
        </div>
        <button
          type="button"
          onClick={() => setAge(Math.min(120, age + 1))}
          className="w-12 h-12 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-2xl flex items-center justify-center border border-zinc-705 hover:border-zinc-500 transition-all active:scale-95 shadow-md"
        >
          +
        </button>
      </div>

      {/* Navigation Buttons directly below form */}
      <div className="flex gap-4 w-full mt-6">
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

export default StepAge;
