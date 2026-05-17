/**
 * Tác dụng của file: Màn hình nhập cân nặng hiện tại, hỗ trợ đổi đơn vị LBS/KG và tích hợp bàn phím ảo Numpad.
 * File này dùng cho component cha nào là chính: Onboarding (src/pages/user/onboarding/index.jsx)
 */
import React from 'react';
import Numpad from './Numpad';

const StepWeightCurrent = ({
  weight,
  weightUnit,
  setWeightUnit,
  onNumpadClick,
  onNext,
}) => {
  return (
    <div className="flex flex-col flex-1 items-center w-full">
      <div className="w-full px-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Cân nặng hiện tại?</h2>

        <div className="flex justify-center mb-10">
          <div className="bg-zinc-800 rounded-lg p-1 flex">
            <button
              onClick={() => setWeightUnit('LBS')}
              className={`px-6 py-2 rounded-md font-bold transition-colors ${
                weightUnit === 'LBS' ? 'bg-zinc-200 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              LBS
            </button>
            <button
              onClick={() => setWeightUnit('KG')}
              className={`px-6 py-2 rounded-md font-bold transition-colors ${
                weightUnit === 'KG' ? 'bg-zinc-200 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              KG
            </button>
          </div>
        </div>

        <div className="text-center w-full flex justify-center mb-10">
          <div className="border border-[#c8f31d] rounded-lg py-4 px-8 min-w-[250px] bg-zinc-900/50 text-white">
            <span className="text-4xl font-bold">{weight || '0'}</span>
            <span className="text-2xl text-zinc-400 ml-2">| {weightUnit.toLowerCase()}</span>
          </div>
        </div>
      </div>

      <div className="w-full mt-auto">
        <div className="px-6 mb-6">
          <button
            onClick={onNext}
            className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#b0d815] transition-all"
          >
            Tiếp theo
          </button>
        </div>
        <Numpad onClick={onNumpadClick} />
      </div>
    </div>
  );
};

export default StepWeightCurrent;
