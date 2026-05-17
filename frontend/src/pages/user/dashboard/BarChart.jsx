/**
 * Tác dụng của file: Component tái sử dụng dùng để vẽ các biểu đồ cột dạng dashed line cho lượng calo tiêu thụ và thặng dư calo
 * File này dùng cho component cha nào là chính: StatisticsPage (src/pages/user/dashboard/StatisticsPage.jsx)
 */
import React from 'react';

const BarChart = ({ data, maxVal, goalLine, height = 160, barColor = '#22c55e' }) => (
  <div className="relative" style={{ height }}>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="absolute left-0 right-0 flex items-center" style={{ top: `${(i / 4) * 100}%` }}>
        <span className="text-[9px] text-zinc-500 w-14 shrink-0">{(maxVal - (maxVal / 4) * i).toFixed(0)}</span>
        <div className="flex-1 border-t border-dashed border-zinc-800" />
      </div>
    ))}
    {goalLine != null && maxVal > 0 && (
      <div className="absolute left-14 right-0 border-t-2 border-dashed border-zinc-500"
        style={{ top: `${((maxVal - goalLine) / maxVal) * 100}%` }} />
    )}
    <div className="absolute left-14 right-0 bottom-6 top-0 flex items-end gap-2">
      {data.map((d, i) => {
        const pct = maxVal > 0 ? Math.min((Math.abs(d.value) / maxVal) * 100, 100) : 0;
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-[9px] font-bold text-zinc-500">{d.value}</span>
            <div className="w-full flex flex-col justify-end" style={{ height: '75%' }}>
              <div className="w-full rounded-t" style={{ height: `${Math.max(pct, 2)}%`, backgroundColor: barColor, opacity: d.value === 0 ? 0.2 : 0.85 }} />
            </div>
            <span className="text-[9px] font-bold text-zinc-400 mt-1">{d.label}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default BarChart;
