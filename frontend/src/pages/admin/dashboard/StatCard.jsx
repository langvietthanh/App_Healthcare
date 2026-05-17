/**
 * Tác dụng của file: Hiển thị các thẻ chỉ số tổng quan hệ thống (Tổng người dùng, Món ăn, Bài tập...) với hiệu ứng hover và trend % tăng trưởng.
 * File này dùng cho component cha nào là chính: AdminDashboard (src/pages/admin/dashboard/index.jsx)
 */
import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => {
  return (
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
};

export default StatCard;
