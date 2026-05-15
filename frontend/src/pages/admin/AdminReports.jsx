import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

const dailyLogs = [65, 82, 74, 91, 88, 103, 97, 78, 85, 110, 95, 88, 102, 76];
const maxLog = Math.max(...dailyLogs);

// Phân bổ mục tiêu
const goalDist = [
  { label: 'Giảm cân', value: 52, color: '#f97316' },
  { label: 'Cân bằng', value: 23, color: '#c8f31d' },
  { label: 'Tăng cơ',  value: 25, color: '#22c55e' },
];

// Phân bổ chế độ ăn (lấy từ DIET_PRESETS của app)
const dietDist = [
  { label: 'Cân Bằng',    value: 38, color: '#c8f31d',  detail: 'Carbs 40% · Protein 40% · Fat 20%' },
  { label: 'Low Carb',    value: 27, color: '#22c55e',  detail: 'Carbs 25% · Protein 45% · Fat 30%' },
  { label: 'High Protein', value: 22, color: '#ef4444', detail: 'Carbs 30% · Protein 50% · Fat 20%' },
  { label: 'Tùy Chỉnh',   value: 13, color: '#a78bfa', detail: 'Tỷ lệ do người dùng tự chọn' },
];

// Trạng thái kiểm duyệt CHỈ món ăn (bài tập do admin quản lý)
const moderation = [
  { label: 'Món ăn — Đã duyệt',   value: 3200, color: '#22c55e' },
  { label: 'Món ăn — Chờ duyệt',  value: 48,   color: '#f97316' },
  { label: 'Món ăn — Bị từ chối', value: 164,  color: '#ef4444' },
];

const topContributors = [
  { name: 'Nguyễn Văn A', count: 28, email: 'a@gmail.com' },
  { name: 'Trần Thị B',   count: 21, email: 'b@gmail.com' },
  { name: 'Lê Văn C',     count: 17, email: 'c@gmail.com' },
  { name: 'Phạm Thị D',   count: 13, email: 'd@gmail.com' },
];

const AdminReports = () => {
  const [range, setRange] = useState('7d');

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Báo cáo hệ thống</h1>
          <p className="text-zinc-500 text-sm">Phân tích hoạt động & kiểm duyệt nội dung</p>
        </div>
        <div className="flex gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          {['7d', '30d', '90d'].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${range === r ? 'bg-[#c8f31d] text-black' : 'text-zinc-400 hover:text-white'}`}>
              {r === '7d' ? '7 ngày' : r === '30d' ? '30 ngày' : '90 ngày'}
            </button>
          ))}
        </div>
      </div>

      {/* Biểu đồ hoạt động */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-white">Hoạt động người dùng — DailyLog/ngày</h2>
          <div className="flex items-center gap-1 text-xs font-bold text-[#c8f31d]">
            <TrendingUp size={14} />+12% so với kỳ trước
          </div>
        </div>
        <div className="flex items-end gap-2 h-36">
          {dailyLogs.slice(range === '7d' ? -7 : -14).map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full rounded-t-lg transition-all"
                style={{ height: `${(v / maxLog) * 100}%`, backgroundColor: '#c8f31d', opacity: 0.75 + (v / maxLog) * 0.25 }}>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-700 text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {v}
                </div>
              </div>
              <span className="text-[9px] text-zinc-600">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Phân bổ mục tiêu */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-6">Phân bổ mục tiêu người dùng</h2>
          <div className="space-y-5">
            {goalDist.map((g, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-300 font-medium">{g.label}</span>
                  <span className="font-black" style={{ color: g.color }}>{g.value}%</span>
                </div>
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${g.value}%`, backgroundColor: g.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phân bổ chế độ ăn */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-6">Phân bổ chế độ ăn</h2>
          <div className="space-y-4">
            {dietDist.map((d, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <div>
                    <span className="font-semibold text-zinc-200">{d.label}</span>
                    <span className="text-[10px] text-zinc-600 ml-2">{d.detail}</span>
                  </div>
                  <span className="font-black" style={{ color: d.color }}>{d.value}%</span>
                </div>
                <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.value}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Kiểm duyệt món ăn (bỏ bài tập) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-2">Trạng thái kiểm duyệt Món ăn</h2>
          <p className="text-xs text-zinc-600 mb-6">Bài tập do Admin quản lý trực tiếp, không cần duyệt.</p>
          <div className="space-y-3">
            {moderation.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <span className="text-sm text-zinc-300">{m.label}</span>
                </div>
                <span className="font-black text-white">{m.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top đóng góp */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-800">
            <h2 className="font-bold text-white">Top người dùng đóng góp Món ăn</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
                <th className="text-left px-6 py-3 font-semibold">Hạng</th>
                <th className="text-left px-6 py-3 font-semibold">Người dùng</th>
                <th className="text-left px-6 py-3 font-semibold">Số đóng góp</th>
              </tr>
            </thead>
            <tbody>
              {topContributors.map((u, i) => (
                <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${i === 0 ? 'bg-[#c8f31d] text-black' : 'bg-zinc-800 text-zinc-400'}`}>{i + 1}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white">{u.name}</p>
                    <p className="text-xs text-zinc-500">{u.email}</p>
                  </td>
                  <td className="px-6 py-4 font-black text-[#c8f31d]">{u.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AdminReports;
