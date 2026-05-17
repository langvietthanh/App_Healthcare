/**
 * Tác dụng của file: Màn hình thống kê chi tiết calo theo tuần/tháng, tích hợp biểu đồ cột BarChart và tóm tắt calo nạp/calo mục tiêu/thặng dư
 * File này dùng cho component cha nào là chính: Dashboard (src/pages/user/dashboard/index.jsx)
 */
import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import BarChart from './BarChart';

const StatisticsPage = ({ onBack }) => {
  const [mode, setMode] = useState('week');
  const [offset, setOffset] = useState(0);
  const goalKcal = 2852;
  const isWeek = mode === 'week';
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const monthWeeks = ['T1', 'T2', 'T3', 'T4'];
  const chartData = isWeek
    ? weekDays.map((d) => ({ label: d, value: 0 }))
    : monthWeeks.map((w) => ({ label: w, value: 0 }));
  const surplusChart = isWeek
    ? weekDays.map((d, i) => ({ label: d, value: i < 5 ? -goalKcal : 0 }))
    : monthWeeks.map((w, i) => ({ label: w, value: i < 3 ? -goalKcal * 7 : 0 }));
  const maxConsumption = isWeek ? goalKcal * 1.1 : goalKcal * 7 * 1.1;
  const maxSurplus = isWeek ? 3027 : 3027 * 7;

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
          {['week', 'month'].map((m, i) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === m ? 'bg-[#c8f31d] text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
            >
              {i === 0 ? 'Theo tuần' : 'Theo tháng'}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-2">
          <button onClick={() => setOffset((o) => o - 1)} className="text-zinc-300 hover:text-[#c8f31d]">
            <ChevronLeft size={24} />
          </button>
          <span className="font-bold text-lg">{isWeek ? '11/5 - 17/5' : 'Tháng 5/2025'}</span>
          <button onClick={() => setOffset((o) => o + 1)} className="text-zinc-300 hover:text-[#c8f31d]">
            <ChevronRight size={24} />
          </button>
        </div>
        {[
          { title: 'Mức tiêu thụ Calo', data: chartData, max: maxConsumption, goal: goalKcal, color: '#22c55e' },
          { title: 'Biểu đồ thặng dư Calo', data: surplusChart, max: maxSurplus, goal: 0, color: '#22c55e' },
        ].map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg">
            <h2 className="font-bold text-base mb-5">{card.title}</h2>
            <BarChart
              data={card.data}
              maxVal={card.max}
              goalLine={card.goal}
              height={170}
              barColor={card.color}
            />
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-6 border-t-2 border-dashed border-zinc-400" />
                <span className="text-xs text-zinc-400">Mục tiêu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#f97316]" />
                <span className="text-xs text-zinc-400">Thực tế</span>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg">
          <h2 className="font-bold text-base mb-4">Tóm tắt {isWeek ? 'tuần' : 'tháng'}</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Tổng Calo nạp', value: '0 kcal', color: '#f97316' },
              {
                label: 'Mục tiêu',
                value: `${(goalKcal * (isWeek ? 7 : 30)).toLocaleString()} kcal`,
                color: '#c8f31d',
              },
              {
                label: 'Thặng dư TB',
                value: isWeek ? '-2852 kcal' : '-85.560 kcal',
                color: '#ef4444',
              },
              { label: isWeek ? 'Ngày đạt mục tiêu' : 'Tuần đạt mục tiêu', value: '0', color: '#22c55e' },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-800 rounded-2xl p-4">
                <p className="text-[11px] text-zinc-500 mb-2">{item.label}</p>
                <p className="font-black text-lg" style={{ color: item.color }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
