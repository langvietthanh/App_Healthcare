/**
 * Tác dụng của file: Màn hình nhập cân nặng mục tiêu mong muốn đạt được, tích hợp đổi đơn vị LBS/KG và nhập số trực tiếp.
 * File này dùng cho component cha nào là chính: Onboarding (src/pages/user/onboarding/index.jsx)
 */
import React from 'react';

const UnitToggle = ({ unit, setUnit, label1 = 'LBS', label2 = 'KG' }) => (
  <div className="flex justify-center mb-6">
    <div className="bg-zinc-800/80 rounded-lg p-1 flex border border-zinc-700/50">
      <button
        type="button"
        onClick={() => setUnit(label1)}
        className={`px-6 py-2 rounded-md font-bold text-sm transition-colors ${
          unit === label1 ? 'bg-[#c8f31d] text-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        {label1}
      </button>
      <button
        type="button"
        onClick={() => setUnit(label2)}
        className={`px-6 py-2 rounded-md font-bold text-sm transition-colors ${
          unit === label2 ? 'bg-[#c8f31d] text-black' : 'text-zinc-400 hover:text-white'
        }`}
      >
        {label2}
      </button>
    </div>
  </div>
);

const WeightInput = ({ weight, setWeight, unit }) => (
  <div className="text-center w-full flex justify-center mb-8">
    <div className="flex items-center border border-zinc-800 focus-within:border-[#c8f31d] rounded-2xl py-3 px-6 bg-zinc-900/40 text-white transition-all shadow-inner focus-within:shadow-[0_0_15px_rgba(200,243,29,0.1)]">
      <input
        type="text"
        inputMode="decimal"
        value={weight || ''}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '' || /^\d*\.?\d*$/.test(val)) {
            setWeight(val);
          }
        }}
        className="text-4xl font-bold bg-transparent text-center focus:outline-none w-32 text-[#c8f31d]"
        placeholder="0.0"
        autoFocus
      />
      <span className="text-xl text-zinc-500 border-l border-zinc-800 pl-4 ml-4 font-semibold uppercase">
        {unit.toLowerCase()}
      </span>
    </div>
  </div>
);

const StepWeightGoal = ({
  goalWeight,
  setGoalWeight,
  weightUnit,
  setWeightUnit,
  onNext,
  onPrev,
}) => {
  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-center text-white">Cân nặng mục tiêu?</h2>
      <p className="text-zinc-500 text-sm mb-6 text-center">Đặt mục tiêu cân nặng phù hợp giúp định hình lộ trình tập luyện tốt nhất.</p>

      <UnitToggle unit={weightUnit} setUnit={setWeightUnit} />
      <WeightInput weight={goalWeight} setWeight={setGoalWeight} unit={weightUnit} />

      {/* Navigation Buttons directly below form */}
      <div className="flex gap-4 w-full mt-2">
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

export default StepWeightGoal;
