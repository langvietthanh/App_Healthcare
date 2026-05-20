/**
 * Tác dụng của file: Vẽ hình ảnh bao tử (Stomach Oval) với hiệu ứng sóng nước chuyển động SVG (Xanh/Đỏ/Vàng) dựa trên tỷ lệ % Calo đã nạp thực tế so với mục tiêu.
 * File này dùng cho component cha nào là chính: Diary (src/pages/user/diary/index.jsx)
 */
import React from 'react';

const WaterWaves = ({ percentage }) => (
  <>
    <div
      className="absolute left-1/2 w-[600px] h-[600px] bg-[#c8f31d]/40 rounded-[43%] animate-[spin_7s_linear_infinite] transition-all duration-1000 ease-in-out"
      style={{
        top: `calc(${100 - percentage}% - 10px)`,
        marginLeft: '-300px'
      }}
    ></div>
    <div
      className="absolute left-1/2 w-[600px] h-[600px] bg-[#c8f31d] rounded-[40%] animate-[spin_5s_linear_infinite] transition-all duration-1000 ease-in-out drop-shadow-[0_-5px_15px_rgba(200,243,29,0.3)]"
      style={{
        top: `calc(${100 - percentage}% + 5px)`,
        marginLeft: '-300px'
      }}
    ></div>
  </>
);

const StomachContent = ({ current }) => (
  <div className="relative z-10 text-center flex flex-col items-center mt-4">
    <span className="text-[10px] font-extrabold uppercase tracking-widest text-black bg-[#c8f31d] px-3 py-1 rounded-full mb-2 shadow-lg">
      Đã nạp
    </span>
    <span className="text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none">
      {current}
    </span>
  </div>
);

const StomachIcon = ({ level = 0, current = 0, goal = 2000 }) => {
  const percentage = Math.max(0, Math.min(100, level));

  return (
    <div className="relative flex items-center justify-center p-2">
      {/* Container Oval Dọc */}
      <div className="relative w-[160px] h-[240px] rounded-[100px] border-[6px] border-zinc-800 bg-zinc-900 overflow-hidden shadow-inner flex flex-col items-center justify-center">
        <WaterWaves percentage={percentage} />
        <StomachContent current={current} />
      </div>
    </div>
  );
};

export default StomachIcon;
