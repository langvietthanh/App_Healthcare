import { useState } from 'react';
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
