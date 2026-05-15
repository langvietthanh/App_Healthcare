import React, { useState } from 'react';
import { Users, Utensils, Dumbbell, UserPlus, TrendingUp } from 'lucide-react';

const weeklyData = [
  { label: 'T1', value: 18 }, { label: 'T2', value: 24 }, { label: 'T3', value: 31 },
  { label: 'T4', value: 19 }, { label: 'T5', value: 27 }, { label: 'T6', value: 35 },
  { label: 'T7', value: 22 }, { label: 'T8', value: 29 }, { label: 'T9', value: 41 },
  { label: 'T10', value: 33 }, { label: 'T11', value: 28 }, { label: 'T12', value: 38 },
];
const monthlyData = [
  { label: 'Th1', value: 120 }, { label: 'Th2', value: 145 }, { label: 'Th3', value: 132 },
  { label: 'Th4', value: 178 }, { label: 'Th5', value: 84 },
];

const STATS = [
  { icon: Users,    label: 'Tổng người dùng',    value: '1,248', sub: '+12 hôm nay',      color: '#c8f31d', trend: 5 },
  { icon: UserPlus, label: 'Người dùng mới (7d)', value: '84',    sub: 'so với tuần trước', color: '#22c55e', trend: 12 },
  { icon: Utensils, label: 'Tổng món ăn',          value: '3,412', sub: 'trong hệ thống',   color: '#f97316', trend: 2 },
  { icon: Dumbbell, label: 'Tổng bài tập',          value: '529',   sub: 'trong hệ thống',   color: '#a78bfa', trend: 1 },
];

const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-5 hover:border-zinc-700 transition-colors">
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
      <Icon size={26} style={{ color }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-zinc-500 font-medium mb-1">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
      {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
    </div>
    {trend != null && (
      <div className="flex items-center gap-1 text-xs font-bold text-green-400">
        <TrendingUp size={14} />{trend}%
      </div>
    )}
  </div>
);

const AdminDashboard = () => {
  const [chartMode, setChartMode] = useState('week');
  const chartData = chartMode === 'week' ? weeklyData : monthlyData;
  const maxVal = Math.max(...chartData.map(d => d.value));

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Tổng quan hệ thống</h1>
        <p className="text-zinc-500 text-sm">Thứ Năm, 15 tháng 5, 2026</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS.map((s, i) => <StatCard key={i} {...s} />)}
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
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex flex-col justify-end" style={{ height: '85%' }}>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {d.value} users
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
          {[65, 82, 74, 91, 88, 103, 97].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[#a78bfa]/80 rounded-t-lg hover:bg-[#a78bfa] transition-colors"
                style={{ height: `${(v / 110) * 100}%` }} />
              <span className="text-[10px] text-zinc-500 font-medium">{['T2','T3','T4','T5','T6','T7','CN'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
