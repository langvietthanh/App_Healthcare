import { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { useAdminDashBoard } from '../../../providers/admin/index';
import NewUsersChart from './NewUsersChart';
import DeepAnalysisSection from './DeepAnalysisSection';

const AdminDashboard = () => {
  const [chartMode, setChartMode] = useState('week');
  const {
    state,
    fetchAdminDashBoard
  } = useAdminDashBoard();

  useEffect(() => {
    fetchAdminDashBoard();
  }, [fetchAdminDashBoard]);

  const chartData = chartMode === 'week'
    ? (state.newUsersWeekly?.chartData || [])
    : (state.newUsersMonthly?.chartData || []);

  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  const getTodayFormatted = () => {
    const today = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return `${days[today.getDay()]} , ${today.getDate()} tháng ${today.getMonth() + 1}, ${today.getFullYear()}`;
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Tổng quan hệ thống</h1>
        <p className="text-zinc-500 text-sm">{getTodayFormatted()}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {state.stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Biểu đồ người dùng mới */}
      <NewUsersChart
        chartMode={chartMode}
        setChartMode={setChartMode}
        chartData={chartData}
        maxVal={maxVal}
      />

      {/* Phân tích & Báo cáo */}
      <DeepAnalysisSection />
    </div>
  );
};

export default AdminDashboard;
