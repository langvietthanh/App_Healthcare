/**
 * Tác dụng của file: Màn hình chào mừng và tổng kết, sẵn sàng bắt đầu hành trình luyện tập.
 * File này dùng cho component cha nào là chính: Onboarding (src/pages/user/onboarding/index.jsx)
 */
import React from 'react';

const StepFinish = ({ onSubmit }) => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center w-full px-6 text-center text-white">
      <h2 className="text-4xl font-bold mb-4 mt-10">Bắt đầu nào!</h2>
      <p className="text-zinc-400 mb-10">
        Hãy bắt đầu quá trình luyện tập, chúng tôi sẽ giúp bạn đạt được mục tiêu thể hình của mình.
      </p>

      {/* Circle Image Placeholder */}
      <div className="w-64 h-64 rounded-full border-4 border-[#c8f31d] p-1 mb-10 overflow-hidden shadow-[0_0_30px_rgba(200,243,29,0.3)] mx-auto relative group cursor-pointer">
        <div className="w-full h-full rounded-full bg-zinc-800 flex flex-col items-center justify-center overflow-hidden">
          <span className="text-6xl mb-2 group-hover:scale-110 transition-transform">🏋️‍♂️</span>
          <span className="text-xs text-zinc-500 font-medium">Sẵn sàng!</span>
        </div>
      </div>

      <p className="text-lg text-zinc-300 font-light mb-10">
        "Kiến tạo <span className="text-[#c8f31d] font-bold">cơ thể mơ ước</span>, giải phóng bản thân, thay đổi cuộc sống"
      </p>

      <div className="w-full mt-auto pb-8">
        <button
          onClick={onSubmit}
          className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-xl text-lg hover:bg-[#b0d815] transition-all"
        >
          Bắt Đầu Tập Luyện!
        </button>
      </div>
    </div>
  );
};

export default StepFinish;
