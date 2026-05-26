/**
 * Tác dụng của file: Bảng hiển thị thông tin danh sách người dùng (Họ tên, email, mục tiêu tập luyện, cân nặng, chiều cao, ngày tham gia, trạng thái hoạt động).
 * File này dùng cho component cha nào là chính: AdminUsers (src/pages/admin/users/index.jsx)
 */
import React from 'react';
import { Eye, Trash2 } from 'lucide-react';

const goalColor = { 'lose_weight': '#f97316', 'gain_muscle': '#22c55e', 'balance': '#c8f31d' };
const goalLabel = {
  'lose_weight': 'Giảm cân',
  'balance': 'Cân bằng',
  'gain_muscle': 'Tăng cơ'
};

const getBmiStatus = (bmi) => {
  if (!bmi) return { label: 'N/A', color: 'text-zinc-500' };
  if (bmi < 18.5) return { label: 'Thiếu cân', color: 'text-blue-400' };
  if (bmi < 25) return { label: 'Bình thường', color: 'text-green-400' };
  if (bmi < 30) return { label: 'Thừa cân', color: 'text-orange-400' };
  return { label: 'Béo phì', color: 'text-red-500' };
};

const UserTable = ({ filtered, onViewDetails, onDeleteUser }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
            {['Người dùng', 'Mục tiêu', 'Thể trạng', 'BMI', 'Ngày tham gia', 'Hành động'].map((h) => (
              <th key={h} className="text-left px-6 py-4 font-semibold text-zinc-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-zinc-600 font-medium">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            filtered.map((u) => {
              const bmi = u.physicalDetail?.bmi;
              const bmiStatus = getBmiStatus(bmi);
              return (
                <tr key={u._id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-black text-[#c8f31d]">
                        {u.username.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{u.username}</p>
                        <p className="text-xs text-zinc-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ backgroundColor: `${goalColor[u.goals?.goal]}20`, color: goalColor[u.goals?.goal] }}
                    >
                      {goalLabel[u.goals?.goal]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-300 whitespace-nowrap">
                    {u.physicalDetail?.height} cm / {u.physicalDetail?.weight} kg
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{bmi ? bmi.toFixed(1) : '-'}</span>
                      <span className={`text-[10px] font-bold ${bmiStatus.color}`}>{bmiStatus.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 text-xs">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => onViewDetails(u)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-[#c8f31d] transition-colors"
                      >
                        <Eye size={14} /> Xem
                      </button>
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => onDeleteUser(u._id, u.username)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} /> Xóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
