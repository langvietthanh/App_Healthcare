/**
 * Tác dụng của file: Hiển thị biểu đồ hoạt động của hệ thống (lượng DailyLog tạo mới theo mốc thời gian 7/30/90 ngày).
 * File này dùng cho component cha nào là chính: AdminReports (src/pages/admin/reports/index.jsx)
 */
import React from 'react';
import { TrendingUp } from 'lucide-react';

const SystemActivityChart = ({ dailyLogs, maxLog, range }) => {
  const visibleLogs = dailyLogs.slice(range === '7d' ? -7 : range === '30d' ? -14 : -14); // Keep chart bounds consistent

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-white text-base">Hoạt động người dùng — DailyLog/ngày</h2>
        <div className="flex items-center gap-1 text-xs font-bold text-[#c8f31d]">
          <TrendingUp size={14} />+12% so với kỳ trước
        </div>
      </div>
      <div className="flex items-end gap-2 h-36">
        {visibleLogs.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div
              className="relative w-full rounded-t-lg transition-all"
              style={{
                height: `${(v / maxLog) * 100}%`,
                backgroundColor: '#c8f31d',
                opacity: 0.75 + (v / maxLog) * 0.25,
              }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-700 text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                {v}
              </div>
            </div>
            <span className="text-[9px] text-zinc-600">{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemActivityChart;
