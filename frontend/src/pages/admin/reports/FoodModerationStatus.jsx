/**
 * Tác dụng của file: Hiển thị danh sách tổng quan trạng thái kiểm duyệt các món ăn trong hệ thống (Đã duyệt, Chờ duyệt, Bị từ chối).
 * File này dùng cho component cha nào là chính: AdminReports (src/pages/admin/reports/index.jsx)
 */
import React from 'react';

const FoodModerationStatus = ({ moderation }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="font-bold text-white text-base mb-2">Trạng thái kiểm duyệt Món ăn</h2>
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
  );
};

export default FoodModerationStatus;
