import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import BarChart from './BarChart';
import { useDailyLog } from '../../../providers/user/dailyLog';

const StatisticsPage = ({ onBack }) => {
  const { state, fetchCalorieHistory } = useDailyLog();
  const { user, calorieHistory } = state;

  const [mode, setMode] = useState('day');
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const init = async () => {
      const now = new Date();
      let from, to;
      const formatLocal = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      if (mode === 'day' || mode === 'week') {
        const targetDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
        const firstDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        const lastDay = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
        from = formatLocal(firstDay);
        to = formatLocal(lastDay);
      } else {
        const targetYear = now.getFullYear() + offset;
        const firstDay = new Date(targetYear, 0, 1);
        const lastDay = new Date(targetYear, 11, 31);
        from = formatLocal(firstDay);
        to = formatLocal(lastDay);
      }

      const userGoal = user?.goals?.dailyCalories || 2000;
      await fetchCalorieHistory(from, to, mode, userGoal);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, offset, user]);

  const { chartData = [], goalKcal = 2000 } = calorieHistory || {};

  const maxConsumption = Math.max(...chartData.map(d => d.value || 0), goalKcal * 1.2);

  const now = new Date();
  let dateString;
  if (mode === 'day' || mode === 'week') {
    const targetDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    dateString = `Tháng ${targetDate.getMonth() + 1}/${targetDate.getFullYear()}`;
  } else {
    const targetYear = now.getFullYear() + offset;
    dateString = `Năm ${targetYear}`;
  }

  return (
    <div className="flex flex-col min-h-full bg-[#111] text-white">
      <div className="flex items-center gap-4 px-6 pt-10 pb-6">
        <button onClick={onBack} className="text-white hover:text-[#c8f31d]">
          <ArrowLeft size={26} />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">Thống kê</h1>
        <div className="w-6" />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-6 scrollbar-hide">
        <div className="bg-zinc-800 rounded-2xl flex p-1.5">
          {['day', 'week', 'month'].map((m) => (
            // GIAO DIỆN STATISTICS PAGE
            <button
              key={m}
              onClick={() => { setMode(m); setOffset(0); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === m ? 'bg-[#c8f31d] text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
            >
              {m === 'day' ? 'Ngày' : m === 'week' ? 'Tuần' : 'Tháng'}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-2">
          <button onClick={() => setOffset((o) => o - 1)} className="text-zinc-300 hover:text-[#c8f31d] opacity-50">
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-lg">{dateString}</span>
          <button onClick={() => setOffset((o) => o + 1)} className="text-zinc-300 hover:text-[#c8f31d] opacity-50">
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg">
          <h2 className="font-bold text-base mb-5">Mức tiêu thụ Calo</h2>
          <div className="overflow-x-auto scrollbar-hide">
            <div style={{ minWidth: mode === 'day' ? '800px' : '100%' }}>
              <BarChart
                data={chartData}
                maxVal={maxConsumption}
                minVal={0}
                goalLine={goalKcal}
                height={190}
                isDynamicColor={true}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-zinc-500 border border-dashed" />
              <span className="text-xs text-zinc-400">Mục tiêu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#c8f31d]" />
              <span className="text-xs text-zinc-400">Thực tế</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="text-xs text-zinc-400">Vượt mục tiêu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
