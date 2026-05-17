/**
 * Tác dụng của file: Điều phối chính và quản lý State hiển thị (Ngày/Tuần) cho trang Nhật ký Dinh dưỡng (Diary) của người dùng
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/user/index.js)
 */
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import StomachIcon from './StomachIcon';
import BatteryInfo from './BatteryInfo';
import CircularMacro from './CircularMacro';
import WeeklyView from './WeeklyView';
import DietSection from './DietSection';

const Diary = () => {
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'week'
  const currentKcal = 593;
  const goalKcal = 2752;
  const percentage = (currentKcal / goalKcal) * 100;

  return (
    <div className="flex flex-col min-h-full pb-10 text-white bg-transparent">
      {/* Header */}
      <div className="flex justify-between items-center px-10 py-10">
        <div>
          <h1 className="text-3xl font-extrabold mb-1 tracking-tight">Hôm nay, 7 Tháng 5</h1>
          <p className="text-sm text-zinc-400 font-medium">🎉 Bạn đã giảm 3.0 kg trong 44 ngày. Cố lên nhé!</p>
        </div>
        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-[#c8f31d] shadow-lg cursor-pointer hover:bg-zinc-700 transition-colors">
          <Calendar size={22} strokeWidth={2.5} />
        </div>
      </div>

      {/* Date Picker (Horizontal) */}
      <div className="flex justify-between items-center px-10 mb-10 text-xl font-bold">
        <span className="text-zinc-700 cursor-pointer hover:text-zinc-500 transition-colors">4</span>
        <span className="text-zinc-600 cursor-pointer hover:text-zinc-500 transition-colors">5</span>
        <span className="text-zinc-500 cursor-pointer hover:text-zinc-400 transition-colors">6</span>
        <div className="w-12 h-12 rounded-full bg-[#c8f31d] text-black flex items-center justify-center shadow-[0_0_15px_rgba(200,243,29,0.3)]">
          7
        </div>
        <span className="text-zinc-500 cursor-pointer hover:text-zinc-400 transition-colors">8</span>
        <span className="text-zinc-600 cursor-pointer hover:text-zinc-500 transition-colors">9</span>
        <span className="text-zinc-700 cursor-pointer hover:text-zinc-500 transition-colors">10</span>
      </div>

      {/* Main Card */}
      <div className="px-8 mb-8">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight">Calo & Dinh dưỡng</h2>
            <div className="bg-zinc-800/80 rounded-xl flex p-1 border border-zinc-700/50">
              <button
                onClick={() => setViewMode('day')}
                className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'day' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Ngày
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'week' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Tuần
              </button>
            </div>
          </div>

          {viewMode === 'day' ? (
            <>
              <div className="flex items-center justify-between mb-12 px-2">
                {/* Left: Stomach Progress */}
                <div className="flex-1 flex justify-center">
                  <StomachIcon level={percentage} current={currentKcal} goal={goalKcal} />
                </div>
                {/* Right: Unified Battery */}
                <div className="flex-1 flex flex-col justify-center ml-8">
                  <BatteryInfo current={currentKcal} goal={goalKcal} />
                </div>
              </div>
              <div className="relative w-full mb-8 flex items-center justify-center">
                <div className="absolute w-full border-t-2 border-dashed border-zinc-800"></div>
              </div>
              <div className="flex justify-between items-center px-1">
                <CircularMacro label="Carbs" current={1} total={275} color="#eab308" />
                <CircularMacro label="Protein" current={118} total={275} color="#ef4444" />
                <CircularMacro label="Fat" current={10} total={61} color="#22c55e" />
                <CircularMacro label="Nước" current={1.5} total={2} color="#0ea5e9" unit="L" />
              </div>
            </>
          ) : (
            <WeeklyView />
          )}
        </div>
      </div>

      {/* Chế độ ăn */}
      <div className="px-8 mb-8">
        <DietSection />
      </div>
    </div>
  );
};

export default Diary;
