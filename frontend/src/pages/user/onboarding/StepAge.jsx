/**
 * Tác dụng của file: Màn hình nhập tuổi bằng cách bấm tăng/giảm hoặc chọn nhanh các mốc tuổi lân cận.
 * File này dùng cho component cha nào là chính: Onboarding (src/pages/user/onboarding/index.jsx)
 */
import React from 'react';

const AgePicker = ({ age, setAge }) => (
  <div className="flex-1 flex flex-col items-center justify-center w-full relative">
    <div className="absolute top-1/2 -translate-y-1/2 w-48 h-20 border border-[#c8f31d] rounded-lg z-0"></div>
    <div className="z-10 text-center space-y-6">
      <div
        className="text-zinc-600 text-2xl font-bold cursor-pointer"
        onClick={() => setAge(age - 2)}
      >
        {age - 2}
      </div>
      <div
        className="text-zinc-500 text-3xl font-bold cursor-pointer"
        onClick={() => setAge(age - 1)}
      >
        {age - 1}
      </div>
      <div className="text-[#c8f31d] text-6xl font-bold my-4">{age}</div>
      <div
        className="text-zinc-500 text-3xl font-bold cursor-pointer"
        onClick={() => setAge(age + 1)}
      >
        {age + 1}
      </div>
      <div
        className="text-zinc-600 text-2xl font-bold cursor-pointer"
        onClick={() => setAge(age + 2)}
      >
        {age + 2}
      </div>
    </div>
  </div>
);

const StepAge = ({ age, setAge, onNext }) => {
  return (
    <div className="flex flex-col flex-1 items-center w-full">
      <h2 className="text-3xl font-bold mb-10 text-center w-full text-white">Bạn bao nhiêu tuổi?</h2>

      <AgePicker age={age} setAge={setAge} />

      <div className="w-full px-6 pb-8 mt-auto">
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

export default StepAge;
