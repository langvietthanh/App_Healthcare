/**
 * Tác dụng của file: Hiển thị tỷ lệ người dùng sử dụng các chế độ dinh dưỡng khác nhau (Low Carb, Cân bằng, High Protein, Tự chọn).
 * File này dùng cho component cha nào là chính: AdminReports (src/pages/admin/reports/index.jsx)
 */
import React from 'react';

const DietDistribution = ({ dietDist }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="font-bold text-white text-base mb-6">Phân bổ chế độ ăn</h2>
      <div className="space-y-4">
        {dietDist.map((d, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1.5">
              <div>
                <span className="font-semibold text-zinc-200">{d.label}</span>
                <span className="text-[10px] text-zinc-600 ml-2">{d.detail}</span>
              </div>
              <span className="font-black" style={{ color: d.color }}>
                {d.value}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${d.value}%`, backgroundColor: d.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DietDistribution;
