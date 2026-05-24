import React, { useState, useEffect } from 'react';
import axiosClient from '../../../config/axiosClient';

const ChartSection = ({ totalWeekKcal, totalWeekGoal, weeklyData, radius, circumference, offset }) => (
  <div className="flex items-end gap-4 mb-8">
    <div className="flex-none flex flex-col items-center justify-center">
      <div className="relative w-[110px] h-[110px] flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={radius} stroke="#3f3f46" strokeWidth="10" fill="transparent" />
          <circle cx="65" cy="65" r={radius} stroke="#f97316" strokeWidth="10" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-black text-[#f97316] leading-none">{totalWeekKcal}</span>
          <div className="w-8 h-[2px] bg-white/30 my-1"></div>
          <span className="text-xs font-bold text-zinc-400">{totalWeekGoal}</span>
        </div>
      </div>
    </div>

    <div className="flex-1 flex items-end justify-between gap-1">
      {weeklyData.map((d, i) => {
        const barPct = d.max > 0 ? Math.max((d.kcal / d.max) * 100, 4) : 4;
        const barColor = d.kcal > 0 ? '#f97316' : '#27272a';
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-[9px] font-bold text-zinc-500">{d.kcal}</span>
            <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: '90px', backgroundColor: '#27272a' }}>
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-1000"
                style={{ height: `${Math.min(barPct, 100)}%`, backgroundColor: barColor }}
              />
            </div>
            <span className="text-[10px] font-bold text-zinc-400">{d.day}</span>
          </div>
        );
      })} 
    </div>
  </div>
);

const MacrosSection = ({ macros }) => (
  <div className="space-y-5">
    <h3 className="text-sm font-bold text-zinc-400">Trung bình Macros (7 ngày)</h3>
    {macros.map((m) => {
      const pct = m.total > 0 ? (m.current / m.total) * 100 : 0;
      return (
        <div key={m.label}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-base flex items-center gap-2">
              <span>{m.icon}</span> {m.label}
            </span>
            <span className="text-sm font-bold">
              <span className="text-white font-black">{m.current}</span>
              <span className="text-zinc-500">/{m.total}g</span>
            </span>
          </div>
          <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: m.color }}
            />
          </div>
        </div>
      );
    })}
  </div>
);

const WeeklyView = ({ targetKcal, targetCarbs, targetProtein, targetFat}) => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axiosClient.get('/reports/weekly');
        const data = res.data || res;
        setReport(data);
        console.log(data);
      } catch (err) {
        console.error('Error fetching weekly report:', err);
      }
    };
    fetchReport();
  }, []);

  // Mapping để chuyển đổi getDay() (0-6) sang chữ
  const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  
  // Luôn bắt đầu từ T2 và kết thúc ở CN
  let weeklyData = [
    { day: 'T2', kcal: 0, max: targetKcal || 2000 },
    { day: 'T3', kcal: 0, max: targetKcal || 2000 },
    { day: 'T4', kcal: 0, max: targetKcal || 2000 },
    { day: 'T5', kcal: 0, max: targetKcal || 2000 },
    { day: 'T6', kcal: 0, max: targetKcal || 2000 },
    { day: 'T7', kcal: 0, max: targetKcal || 2000 },
    { day: 'CN', kcal: 0, max: targetKcal || 2000 },
  ];
  
  let totalWeekKcal = 0;

  if (report && report.dailyData) {
    report.dailyData.forEach(d => {
      const dateObj = new Date(d.date);
      const label = dayLabels[dateObj.getDay()];
      
      // Tìm thứ tương ứng trong mảng cố định để cập nhật Kcal
      const index = weeklyData.findIndex(item => item.day === label);
      if (index !== -1) {
        weeklyData[index].kcal = d.caloriesIn;
      }
      totalWeekKcal += d.caloriesIn;
    });
  }

  const totalWeekGoal = (targetKcal || 2000) * 7;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min((totalWeekKcal / totalWeekGoal) * 100, 100) || 0;
  const offset = circumference - (pct / 100) * circumference;

  // Lấy trung bình Macros từ báo cáo
  const avg = report?.averages || { carbs: 0, protein: 0, fat: 0 };

  const totalMacro = report?.totals || { carbs: 0, protein: 0, fat: 0 };

  const macros = [
    { label: 'Carbs', icon: '🌾', current: totalMacro.carbs, total: targetCarbs * 7, color: '#eab308' },
    { label: 'Chất đạm', icon: '🥩', current: totalMacro.protein, total: targetProtein * 7, color: '#ef4444' },
    { label: 'Chất béo', icon: '🥑', current: totalMacro.fat, total: targetFat * 7, color: '#22c55e' },
  ];

  return (
    <div>
      <ChartSection 
        totalWeekKcal={totalWeekKcal} 
        totalWeekGoal={totalWeekGoal} 
        weeklyData={weeklyData} 
        radius={radius} 
        circumference={circumference} 
        offset={offset} 
      />

      <div className="flex justify-end mb-6">
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold text-sm cursor-pointer hover:bg-zinc-700 transition-colors" title="Thống kê trung bình dựa trên 7 ngày gần nhất">?</div>
      </div>

      <div className="border-t border-dashed border-zinc-700 mb-6" />

      <MacrosSection macros={macros} />
    </div>
  );
};

export default WeeklyView;
