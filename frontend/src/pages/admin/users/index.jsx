/**
 * Tác dụng của file: Quản lý State tìm kiếm người dùng, lọc dữ liệu, và kiểm soát mở/đóng hộp thoại chi tiết tài khoản người dùng.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/admin/index.js)
 */
import React, { useState } from 'react';

import UserSearch from './UserSearch';
import UserTable from './UserTable';
import UserDetailModal from './UserDetailModal';

const mockUsers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com', goal: 'Giảm cân', weight: 75, height: 170, joined: '01/04/2026', status: 'active' },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com', goal: 'Tăng cơ', weight: 58, height: 162, joined: '15/03/2026', status: 'active' },
  { id: 3, name: 'Lê Văn C', email: 'c@gmail.com', goal: 'Cân bằng', weight: 68, height: 175, joined: '10/02/2026', status: 'active' },
  { id: 4, name: 'Phạm Thị D', email: 'd@gmail.com', goal: 'Giảm cân', weight: 82, height: 165, joined: '05/01/2026', status: 'inactive' },
  { id: 5, name: 'Hoàng Văn E', email: 'e@gmail.com', goal: 'Tăng cơ', weight: 62, height: 178, joined: '20/04/2026', status: 'active' },
];

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

      <UserSearch search={search} setSearch={setSearch} />

      <UserTable filtered={filtered} onViewDetails={setSelectedUser} />

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
