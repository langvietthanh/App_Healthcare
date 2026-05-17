/**
 * Tác dụng của file: Điều phối chính quản lý State điều hướng giữa các màn hình (home, stats, weight) và render component tương ứng
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/user/index.js)
 */
import React, { useState } from 'react';
import DashboardHome from './DashboardHome';
import WeightChart from './WeightChart';
import StatisticsPage from './StatisticsPage';

const Dashboard = () => {
  const [page, setPage] = useState('home'); // 'home' | 'stats' | 'weight'

  if (page === 'stats') return <StatisticsPage onBack={() => setPage('home')} />;
  if (page === 'weight') return <WeightChart onBack={() => setPage('home')} />;

  return <DashboardHome setPage={setPage} />;
};

export default Dashboard;
