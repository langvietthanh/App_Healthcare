/**
 * Tác dụng của file: Quản lý State tìm kiếm người dùng, lọc dữ liệu, và kiểm soát mở/đóng hộp thoại chi tiết tài khoản người dùng.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/admin/index.js)
 */
import React, { useState, useEffect } from 'react';
import { useAdminUser } from '../../../context/admin/';
import { Trash2 } from 'lucide-react';
import UserSearch from './UserSearch';
import UserTable from './UserTable';
import UserDetailModal from './UserDetailModal';

const defaultFilters = {
  gender: 'all',
  ageMin: '',
  ageMax: '',
  activityLevel: 'all',
  tdeeMin: '',
  tdeeMax: '',
  role: 'all',
  dateFrom: '',
  dateTo: '',
};

const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  const diff = Date.now() - new Date(birthDate).getTime();
  const age = new Date(diff); 
  return Math.abs(age.getUTCFullYear() - 1970);
};

const AdminUsers = () => {
  const { state, fetchAllUsers, deleteUser } = useAdminUser();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = state.users.filter(u => {
    // 1. Text search filter
    const matchSearch = u.username.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    
    // 2. Advanced filters
    const pd = u.physicalDetail || {};
    
    // Gender
    if (filters.gender !== 'all' && pd.gender !== filters.gender) return false;
    
    // Age
    const age = calculateAge(u.birthDate);
    if (filters.ageMin !== '' && age < parseInt(filters.ageMin)) return false;
    if (filters.ageMax !== '' && age > parseInt(filters.ageMax)) return false;

    // Activity Level
    if (filters.activityLevel !== 'all' && pd.activityLevel !== filters.activityLevel) return false;

    // TDEE
    const tdee = pd.tdee || 0;
    if (filters.tdeeMin !== '' && tdee < parseInt(filters.tdeeMin)) return false;
    if (filters.tdeeMax !== '' && tdee > parseInt(filters.tdeeMax)) return false;

    // Role
    if (filters.role !== 'all' && u.role !== filters.role) return false;

    // Date Range
    if (filters.dateFrom !== '' || filters.dateTo !== '') {
      const userDate = new Date(u.createdAt).getTime();
      if (filters.dateFrom !== '') {
        const fromDate = new Date(filters.dateFrom).getTime();
        if (userDate < fromDate) return false;
      }
      if (filters.dateTo !== '') {
        // Set time to end of day for the "To" date
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (userDate > toDate.getTime()) return false;
      }
    }

    return true;
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleDeleteUser = (userId, username) => {
    setDeleteConfirm({ userId, username });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteUser(deleteConfirm.userId);
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng.');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Quản lý Người dùng</h1>
        <p className="text-zinc-500 text-sm">{state.users.length} người dùng trong hệ thống</p>
      </div>

      <UserSearch 
        search={search} 
        setSearch={setSearch} 
        filters={filters}
        setFilters={setFilters}
        defaultFilters={defaultFilters}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      <UserTable 
        filtered={filtered} 
        onViewDetails={setSelectedUser} 
        onDeleteUser={handleDeleteUser}
      />

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Modal Xác nhận Xóa */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Xóa người dùng?</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Bạn có chắc chắn muốn xóa tài khoản <span className="text-white font-semibold">"{deleteConfirm.username}"</span> không? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
