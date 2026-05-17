/**
 * Tác dụng của file: Bảng hiển thị thông tin danh sách người dùng (Họ tên, email, mục tiêu tập luyện, cân nặng, chiều cao, ngày tham gia, trạng thái hoạt động).
 * File này dùng cho component cha nào là chính: AdminUsers (src/pages/admin/users/index.jsx)
 */
import React from 'react';
import { Eye } from 'lucide-react';

const goalColor = { 'Giảm cân': '#f97316', 'Tăng cơ': '#22c55e', 'Cân bằng': '#c8f31d' };

const UserTable = ({ filtered, onViewDetails }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
            {['Người dùng', 'Mục tiêu', 'Cân nặng', 'Chiều cao', 'Ngày tham gia', 'Trạng thái', 'Hành động'].map((h) => (
              <th key={h} className="text-left px-6 py-4 font-semibold text-zinc-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-zinc-600 font-medium">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            filtered.map((u) => (
              <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-black text-[#c8f31d]">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{u.name}</p>
                      <p className="text-xs text-zinc-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: `${goalColor[u.goal]}20`, color: goalColor[u.goal] }}
                  >
                    {u.goal}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-300">{u.weight} kg</td>
                <td className="px-6 py-4 text-zinc-300">{u.height} cm</td>
                <td className="px-6 py-4 text-zinc-500 text-xs">{u.joined}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      u.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-zinc-700 text-zinc-400'
                    }`}
                  >
                    {u.status === 'active' ? 'Hoạt động' : 'Không active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewDetails(u)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-[#c8f31d] transition-colors"
                  >
                    <Eye size={14} /> Xem
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
