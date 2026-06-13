import { useState, useEffect } from 'react';
import { useAdminUser } from '../../../providers/admin';
import { defaultFilters } from '../../../providers/admin/users/reducer';
import { Lock, Unlock } from 'lucide-react';
import UserSearch from './UserSearch';
import UserTable from './UserTable';
import UserDetailModal from './UserDetailModal';

const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  const diff = Date.now() - new Date(birthDate).getTime();
  const age = new Date(diff);
  return Math.abs(age.getUTCFullYear() - 1970);
};

const AdminUsers = () => {
  const { state, fetchAllUsers, toggleLockUser, setSearch, setFilters, setTab } = useAdminUser();
  const { search, filters, tab } = state;
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lockConfirm, setLockConfirm] = useState(null);

  const lockedCount = state.users.filter(u => u.status === 'locked').length;

  const filtered = state.users.filter(u => {
    // 0. Tab filter
    if (tab === 'all' && u.status === 'locked') return false;
    if (tab === 'locked' && u.status !== 'locked') return false;

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

    // BMI
    const bmi = pd.bmi || 0;
    if (filters.bmiStatus !== 'all') {
      if (filters.bmiStatus === 'underweight' && bmi >= 18.5) return false;
      if (filters.bmiStatus === 'normal' && (bmi < 18.5 || bmi >= 25)) return false;
      if (filters.bmiStatus === 'overweight' && (bmi < 25 || bmi >= 30)) return false;
      if (filters.bmiStatus === 'obese' && bmi < 30) return false;
    }

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

  const handleToggleLockUser = (userId, username, status) => {
    setLockConfirm({ userId, username, status });
  };

  const confirmToggleLock = async () => {
    if (!lockConfirm) return;
    try {
      await toggleLockUser(lockConfirm.userId);
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi thực hiện thao tác.');
    } finally {
      setLockConfirm(null);
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
        tab={tab}
        setTab={setTab}
        lockedCount={lockedCount}
      />

      <UserTable
        filtered={filtered}
        onViewDetails={setSelectedUser}
        onDeleteUser={handleToggleLockUser}
      />

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {/* Modal Xác nhận Khóa/Mở khóa */}
      {lockConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              lockConfirm.status === 'locked' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
            }`}>
              {lockConfirm.status === 'locked' ? <Unlock size={24} /> : <Lock size={24} />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {lockConfirm.status === 'locked' ? 'Mở khóa người dùng?' : 'Khóa người dùng?'}
            </h3>
            <p className="text-zinc-400 text-sm mb-6">
              Bạn có chắc chắn muốn {lockConfirm.status === 'locked' ? 'mở khóa' : 'khóa'} tài khoản <span className="text-white font-semibold">"{lockConfirm.username}"</span> không?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setLockConfirm(null)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmToggleLock}
                className={`flex-1 py-3 rounded-xl text-white font-semibold transition-colors ${
                  lockConfirm.status === 'locked' 
                    ? 'bg-green-500 hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                    : 'bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                }`}
              >
                {lockConfirm.status === 'locked' ? 'Mở khóa' : 'Khóa ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
