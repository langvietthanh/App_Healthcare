/**
 * Tác dụng của file: Bảng xếp hạng các thành viên đóng góp nhiều món ăn nhất hệ thống kèm theo số lượng đóng góp của họ.
 * File này dùng cho component cha nào là chính: AdminReports (src/pages/admin/reports/index.jsx)
 */
import React from 'react';

const TopContributorsTable = ({ topContributors }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-zinc-800">
        <h2 className="font-bold text-white text-base">Top người dùng đóng góp Món ăn</h2>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
            <th className="text-left px-6 py-3 font-semibold text-zinc-500">Hạng</th>
            <th className="text-left px-6 py-3 font-semibold text-zinc-500">Người dùng</th>
            <th className="text-left px-6 py-3 font-semibold text-zinc-500">Số đóng góp</th>
          </tr>
        </thead>
        <tbody>
          {topContributors.map((u, i) => (
            <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
              <td className="px-6 py-4">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    i === 0 ? 'bg-[#c8f31d] text-black' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {i + 1}
                </span>
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
  );
};

export default TopContributorsTable;
