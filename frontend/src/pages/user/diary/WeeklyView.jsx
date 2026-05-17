/**
 * Tác dụng của file: Giao diện thống kê Calo theo tuần, bao gồm biểu đồ cột 7 ngày, vòng tròn tiến độ tổng tuần và các thanh tiến trình chất dinh dưỡng.
 * File này dùng cho component cha nào là chính: Diary (src/pages/user/diary/index.jsx)
 */
import React from 'react';

const WeeklyView = () => {
  const weeklyData = [
    { day: 'T2', kcal: 0, max: 2752 },
    { day: 'T3', kcal: 0, max: 2752 },
    { day: 'T4', kcal: 0, max: 2752 },
    { day: 'T5', kcal: 0, max: 2752 },
    { day: 'T6', kcal: 0, max: 2752 },
    { day: 'T7', kcal: 0, max: 2752 },
    { day: 'CN', kcal: 0, max: 2752 },
  ];
  const totalWeekKcal = 0;
  const totalWeekGoal = 2752 * 7;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min((totalWeekKcal / totalWeekGoal) * 100, 100);
  const offset = circumference - (pct / 100) * circumference;
  const macros = [
    { label: 'Carbs', icon: '🌾', current: 0, total: 1925, color: '#eab308' },
    { label: 'Chất đạm', icon: '🥩', current: 0, total: 1925, color: '#ef4444' },
    { label: 'Chất béo', icon: '🥑', current: 0, total: 427, color: '#22c55e' },
  ];

  return (
    <div>
      {/* Biểu đồ cột + vòng tròn */}
      <div className="flex items-end gap-4 mb-8">
        {/* Vòng tròn tổng calo */}
        <div className="flex-none flex flex-col items-center justify-center">
          <div className="relative w-[110px] h-[110px] flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r={radius} stroke="#3f3f46" strokeWidth="10" fill="transparent" />
              <circle cx="65" cy="65" r={radius} stroke="#f97316" strokeWidth="10" fill="transparent"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-[#f97316] leading-none">{totalWeekKcal}</span>
              <div className="w-8 h-[2px] bg-white/30 my-1"></div>
              <span className="text-xs font-bold text-zinc-400">{totalWeekGoal}</span>
            </div>
          </div>
        </div>

        {/* Biểu đồ cột 7 ngày */}
        <div className="flex-1 flex items-end justify-between gap-1">
          {weeklyData.map((d, i) => {
            const barPct = d.max > 0 ? Math.max((d.kcal / d.max) * 100, 4) : 4;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[9px] font-bold text-zinc-500">{d.max}</span>
                <div className="w-full rounded-t-lg relative" style={{ height: '90px', backgroundColor: '#27272a' }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg"
                    style={{ height: `${barPct}%`, backgroundColor: '#27272a', opacity: 0.5 }}
                  />
                </div>
                <span className="text-[10px] font-bold text-zinc-400">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dấu ? */}
      <div className="flex justify-end mb-6">
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold text-sm cursor-pointer hover:bg-zinc-700 transition-colors">?</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-zinc-700 mb-6" />

      {/* Macros thanh tiến trình */}
      <div className="space-y-5">
        {macros.map((m) => {
          const pct = m.total > 0 ? (m.current / m.total) * 100 : 0;
          return (
            <div key={m.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-base flex items-center gap-2">
                  <span>{m.icon}</span> {m.label}
                </span>
                <span className="text-sm font-bold">
                  <span className="text-white font-black">{m.current}</span>
                  <span className="text-zinc-500">/{m.total}g</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, backgroundColor: m.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyView;
