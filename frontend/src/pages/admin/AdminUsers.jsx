import React, { useState } from 'react';
import { Search, Filter, Eye, MoreVertical } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', goal: 'Giảm cân', weight: 75, height: 170, joined: '01/04/2026', status: 'active' },
  { id: 2, name: 'Trần Thị B',   email: 'b@gmail.com', goal: 'Tăng cơ',  weight: 58, height: 162, joined: '15/03/2026', status: 'active' },
  { id: 3, name: 'Lê Văn C',     email: 'c@gmail.com', goal: 'Cân bằng', weight: 68, height: 175, joined: '10/02/2026', status: 'active' },
  { id: 4, name: 'Phạm Thị D',   email: 'd@gmail.com', goal: 'Giảm cân', weight: 82, height: 165, joined: '05/01/2026', status: 'inactive' },
  { id: 5, name: 'Hoàng Văn E',  email: 'e@gmail.com', goal: 'Tăng cơ',  weight: 62, height: 178, joined: '20/04/2026', status: 'active' },
];

const goalColor = { 'Giảm cân': '#f97316', 'Tăng cơ': '#22c55e', 'Cân bằng': '#c8f31d' };

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Quản lý Người dùng</h1>
        <p className="text-zinc-500 text-sm">{mockUsers.length} người dùng trong hệ thống</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#c8f31d] transition-colors text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors text-sm font-medium">
          <Filter size={16} /> Lọc
        </button>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
              <th className="text-left px-6 py-4 font-semibold">Người dùng</th>
              <th className="text-left px-6 py-4 font-semibold">Mục tiêu</th>
              <th className="text-left px-6 py-4 font-semibold">Cân nặng</th>
              <th className="text-left px-6 py-4 font-semibold">Chiều cao</th>
              <th className="text-left px-6 py-4 font-semibold">Ngày tham gia</th>
              <th className="text-left px-6 py-4 font-semibold">Trạng thái</th>
              <th className="text-left px-6 py-4 font-semibold">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
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
                  <span className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: `${goalColor[u.goal]}20`, color: goalColor[u.goal] }}>
                    {u.goal}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-300">{u.weight} kg</td>
                <td className="px-6 py-4 text-zinc-300">{u.height} cm</td>
                <td className="px-6 py-4 text-zinc-500 text-xs">{u.joined}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.status === 'active' ? 'bg-green-500/15 text-green-400' : 'bg-zinc-700 text-zinc-400'}`}>
                    {u.status === 'active' ? 'Hoạt động' : 'Không active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => setSelectedUser(u)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-[#c8f31d] transition-colors">
                    <Eye size={14} /> Xem
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl font-black text-[#c8f31d]">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-black text-white">{selectedUser.name}</h2>
                <p className="text-zinc-500 text-sm">{selectedUser.email}</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Mục tiêu', value: selectedUser.goal },
                { label: 'Cân nặng', value: `${selectedUser.weight} kg` },
                { label: 'Chiều cao', value: `${selectedUser.height} cm` },
                { label: 'Ngày tham gia', value: selectedUser.joined },
                { label: 'Trạng thái', value: selectedUser.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-zinc-800 last:border-0">
                  <span className="text-zinc-500 text-sm">{item.label}</span>
                  <span className="text-white font-semibold text-sm">{item.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelectedUser(null)}
              className="w-full mt-6 py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors">
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
