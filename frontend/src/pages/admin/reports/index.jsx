/**
 * Tác dụng của file: Điều phối chính trang Báo cáo hệ thống Admin, quản lý lọc khoảng thời gian báo cáo và kết nối các thành phần phân tích.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/admin/index.js)
 */
import React, { useState } from 'react';

import SystemActivityChart from './SystemActivityChart';
import UserGoalsDistribution from './UserGoalsDistribution';
import DietDistribution from './DietDistribution';
import FoodModerationStatus from './FoodModerationStatus';
import TopContributorsTable from './TopContributorsTable';

const dailyLogs = [65, 82, 74, 91, 88, 103, 97, 78, 85, 110, 95, 88, 102, 76];
const maxLog = Math.max(...dailyLogs);

// Phân bổ mục tiêu
const goalDist = [
  { label: 'Giảm cân', value: 52, color: '#f97316' },
  { label: 'Cân bằng', value: 23, color: '#c8f31d' },
  { label: 'Tăng cơ', value: 25, color: '#22c55e' },
];

// Phân bổ chế độ ăn (lấy từ DIET_PRESETS của app)
const dietDist = [
  { label: 'Cân Bằng', value: 38, color: '#c8f31d', detail: 'Carbs 40% · Protein 40% · Fat 20%' },
  { label: 'Low Carb', value: 27, color: '#22c55e', detail: 'Carbs 25% · Protein 45% · Fat 30%' },
  { label: 'High Protein', value: 22, color: '#ef4444', detail: 'Carbs 30% · Protein 50% · Fat 20%' },
  { label: 'Tùy Chỉnh', value: 13, color: '#a78bfa', detail: 'Tỷ lệ do người dùng tự chọn' },
];

// Trạng thái kiểm duyệt CHỈ món ăn (bài tập do admin quản lý)
const moderation = [
  { label: 'Món ăn — Đã duyệt', value: 3200, color: '#22c55e' },
  { label: 'Món ăn — Chờ duyệt', value: 48, color: '#f97316' },
  { label: 'Món ăn — Bị từ chối', value: 164, color: '#ef4444' },
];

const topContributors = [
  { name: 'Nguyễn Văn A', count: 28, email: 'a@gmail.com' },
  { name: 'Trần Thị B', count: 21, email: 'b@gmail.com' },
  { name: 'Lê Văn C', count: 17, email: 'c@gmail.com' },
  { name: 'Phạm Thị D', count: 13, email: 'd@gmail.com' },
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
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${range === r ? 'bg-[#c8f31d] text-black' : 'text-zinc-400 hover:text-white'
                }`}
            >
              {r === '7d' ? '7 ngày' : r === '30d' ? '30 ngày' : '90 ngày'}
            </button>
          ))}
        </div>
      </div>

      {/* Biểu đồ hoạt động */}
      <SystemActivityChart dailyLogs={dailyLogs} maxLog={maxLog} range={range} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Phân bổ mục tiêu */}
        <UserGoalsDistribution goalDist={goalDist} />

        {/* Phân bổ chế độ ăn */}
        <DietDistribution dietDist={dietDist} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Kiểm duyệt món ăn */}
        <FoodModerationStatus moderation={moderation} />

        {/* Top đóng góp */}
        <TopContributorsTable topContributors={topContributors} />
      </div>
    </div>
  );
};

export default AdminReports;
