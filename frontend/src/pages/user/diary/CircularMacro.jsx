/**
 * Tác dụng của file: Vẽ vòng tròn tiến trình (SVG circular progress) cho từng chất dinh dưỡng đa lượng (Carbs, Protein, Fat, Nước).
 * File này dùng cho component cha nào là chính: Diary (src/pages/user/diary/index.jsx)
 */
import React from 'react';

const CircularMacro = ({ label, current, total, color, unit = 'g' }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((current / total) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center w-[75px] h-[75px]">
        <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
          <circle cx="35" cy="35" r={radius} stroke={color} strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center mt-0.5">
          <span className="text-sm font-bold text-white">{current}</span>
          <span className="text-[9px] text-zinc-500 font-medium">/{total}{unit}</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</span>
    </div>
  );
};

export default CircularMacro;
