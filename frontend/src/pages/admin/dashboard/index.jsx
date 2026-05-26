/**
 * Tác dụng của file: Điều phối trang tổng quan hệ thống Admin, hiển thị biểu đồ người dùng mới theo tuần/tháng và các số liệu DailyLog hoạt động.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/admin/index.js)
 */
import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { TrendingUp } from 'lucide-react';
import { useAdminDashBoard } from '../../../context/admin/index';

const AdminDashboard = () => {
  const [chartMode, setChartMode] = useState('week');
  const {
    state,
    fetchAdminDashBoard
  } = useAdminDashBoard();

  useEffect(() => {
    fetchAdminDashBoard();
  }, []);

  const chartData = chartMode === 'week' 
    ? (state.newUsersWeekly?.chartData || []) 
    : (state.newUsersMonthly?.chartData || []);

  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  const activityData = state.dailyLogCount || [];
  const maxActivityVal = Math.max(...activityData.map(d => d.value), 1);

  const getTodayFormatted = () => {
    const today = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return `${days[today.getDay()]} , ${today.getDate()} tháng ${today.getMonth() + 1}, ${today.getFullYear()}`;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Tổng quan hệ thống</h1>
        <p className="text-zinc-500 text-sm">{getTodayFormatted()}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {state.stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Biểu đồ người dùng mới */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-white text-base">Người dùng mới</h2>
            <p className="text-xs text-zinc-500 mt-1">Thống kê theo {chartMode === 'week' ? 'tuần' : 'tháng'}</p>
          </div>
          <div className="flex gap-2 bg-zinc-800 rounded-xl p-1">
            {[{ key: 'week', label: 'Theo tuần' }, { key: 'month', label: 'Theo tháng' }].map(m => (
              <button key={m.key} onClick={() => setChartMode(m.key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${chartMode === m.key ? 'bg-[#c8f31d] text-black' : 'text-zinc-400 hover:text-white'}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end gap-2 h-48">
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 h-full flex flex-col items-center gap-2 group">
              <div className="relative w-full flex flex-col justify-end" style={{ height: '85%' }}>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-[10px] font-bold px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 text-center shadow-lg">
                  <div className="text-[#c8f31d]">{d.value} users</div>
                  {d.dateRange && <div className="text-[8px] text-zinc-300 font-normal">{d.dateRange}</div>}
                </div>
                <div className="w-full rounded-t-lg transition-all duration-500"
                  style={{ height: `${(d.value / maxVal) * 100}%`, backgroundColor: '#c8f31d', opacity: 0.6 + (d.value / maxVal) * 0.4 }} />
              </div>
              <span className="text-[9px] text-zinc-500 font-medium">{d.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6 mt-6 pt-5 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#c8f31d]" />
            <span className="text-xs text-zinc-400">Người dùng mới</span>
          </div>
          <span className="text-xs text-zinc-500">
            Tổng: <span className="text-[#c8f31d] font-black">{chartData.reduce((s, d) => s + d.value, 0).toLocaleString()}</span>
          </span>
          <div className="ml-auto flex items-center gap-1 text-xs font-bold text-green-400">
            <TrendingUp size={14} />+12% so với kỳ trước
          </div>
        </div>
      </div>

      {/* Activity chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-base text-white">Hoạt động hệ thống (7 ngày)</h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#a78bfa]" />
            <span className="text-xs text-zinc-400">Số DailyLog tạo mới</span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-32">
          {activityData.map((d, i) => (
            <div key={i} className="flex-1 h-full flex flex-col items-center gap-1 group justify-end">
              <div className="relative w-full flex flex-col justify-end" style={{ height: '80%' }}>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {d.value} logs
                </div>
                <div className="w-full bg-[#a78bfa]/80 rounded-t-lg hover:bg-[#a78bfa] transition-colors"
                  style={{ height: `${(d.value / maxActivityVal) * 100}%` }} />
              </div>
              <span className="text-[10px] text-zinc-500 font-medium">{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
