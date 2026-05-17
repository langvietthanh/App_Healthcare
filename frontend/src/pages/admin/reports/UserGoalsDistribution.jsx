/**
 * Tác dụng của file: Hiển thị tỷ lệ phân bổ các mục tiêu sức khỏe của người dùng hệ thống (Giảm cân, Cân bằng, Tăng cơ) bằng thanh tiến trình ngang.
 * File này dùng cho component cha nào là chính: AdminReports (src/pages/admin/reports/index.jsx)
 */
import React from 'react';

const UserGoalsDistribution = ({ goalDist }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="font-bold text-white text-base mb-6">Phân bổ mục tiêu người dùng</h2>
      <div className="space-y-5">
        {goalDist.map((g, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-300 font-medium">{g.label}</span>
              <span className="font-black" style={{ color: g.color }}>
                {g.value}%
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${g.value}%`, backgroundColor: g.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserGoalsDistribution;
