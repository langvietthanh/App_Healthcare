/**
 * Tác dụng của file: Điều phối chính và quản lý State hiển thị (Ngày/Tuần) cho trang Nhật ký Dinh dưỡng (Diary) kết nối live qua Context & Reducer tập trung.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/user/index.js)
 */
import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useDailyLog } from '../../../context/DailyLogContext';

import StomachIcon from './StomachIcon';
import BatteryInfo from './BatteryInfo';
import CircularMacro from './CircularMacro';
import WeeklyView from './WeeklyView';
import DietSection from './DietSection';

const DiaryHeader = ({ getHeaderDateLabel, loading, setSelectedDate, Calendar }) => (
  <div className="flex justify-between items-center px-10 py-10">
    <div>
      <h1 className="text-3xl font-extrabold mb-1 tracking-tight">{getHeaderDateLabel()}</h1>
      <p className="text-sm text-zinc-400 font-medium">
        {loading ? 'Đang cập nhật chỉ số...' : '🎉 Ghi nhận thực đơn và theo dõi tiến trình giảm cân của bạn!'}
      </p>
    </div>
    <button
      onClick={() => setSelectedDate(new Date())}
      className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-[#c8f31d] shadow-lg cursor-pointer hover:bg-zinc-700 transition-colors"
      title="Trở về Hôm nay"
    >
      <Calendar size={22} strokeWidth={2.5} />
    </button>
  </div>
);

const DatePicker = ({ daysOfWeek, selectedDate, setSelectedDate }) => (
  <div className="flex justify-between items-center px-10 mb-10 text-xl font-bold">
    {daysOfWeek.map((day, i) => {
      const isSelected = day.toDateString() === selectedDate.toDateString();
      return (
        <button
          key={i}
          onClick={() => setSelectedDate(day)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-[#c8f31d] text-black shadow-[0_0_15px_rgba(200,243,29,0.4)] scale-110 font-black'
              : 'text-zinc-500 hover:text-white hover:bg-zinc-800/40'
          }`}
        >
          {day.getDate()}
        </button>
      );
    })}
  </div>
);

const NutritionCard = ({
  viewMode, setViewMode
}) => {
  const { state } = useDailyLog();
  const { dailyLog, targetCalories: goalKcal, dietPreset, user } = state;

  const targetWater = user?.physicalDetail?.weight
    ? Math.round(user.physicalDetail.weight * 35)
    : 2000;

  const currentKcal = Math.round(dailyLog?.totals?.caloriesIn || 0);
  const percentage = goalKcal > 0 ? (currentKcal / goalKcal) * 100 : 0;

  const targetCarbs = Math.round((goalKcal * dietPreset.carbs) / 100 / 4);
  const targetProtein = Math.round((goalKcal * dietPreset.protein) / 100 / 4);
  const targetFat = Math.round((goalKcal * dietPreset.fat) / 100 / 9);

  const currentCarbs = Math.round(dailyLog?.totals?.carbs || 0);
  const currentProtein = Math.round(dailyLog?.totals?.protein || 0);
  const currentFat = Math.round(dailyLog?.totals?.fat || 0);
  const currentWater = dailyLog?.waterIntake || 0;

  return (
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
          <div className="flex items-center justify-between mb-12 px-2 flex-col md:flex-row gap-8">
            <div className="flex-1 flex justify-center">
              <StomachIcon level={percentage} current={currentKcal} goal={goalKcal} />
            </div>
            <div className="flex-1 flex flex-col justify-center w-full">
              <BatteryInfo current={currentKcal} goal={goalKcal} />
            </div>
          </div>
          <div className="relative w-full mb-8 flex items-center justify-center">
            <div className="absolute w-full border-t-2 border-dashed border-zinc-800"></div>
          </div>
          <div className="flex justify-between items-center px-1 gap-2 flex-wrap sm:flex-nowrap mb-8">
            <CircularMacro label="Carbs" current={currentCarbs} total={targetCarbs} color="#eab308" />
            <CircularMacro label="Protein" current={currentProtein} total={targetProtein} color="#ef4444" />
            <CircularMacro label="Fat" current={currentFat} total={targetFat} color="#22c55e" />
            <CircularMacro label="Nước" current={currentWater} total={targetWater} color="#0ea5e9" unit="ml" />
          </div>
        </>
      ) : (
        <WeeklyView targetKcal={goalKcal} todayKcal={currentKcal} targetCarbs={targetCarbs} targetProtein={targetProtein} targetFat={targetFat} targetWater={targetWater} />
      )}
    </div>
  </div>
    );
};

const Diary = () => {
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'week'

  const {
    state,
    setSelectedDate,
    fetchDailyOverview,
    fetchUserTarget,
    updateDietPreset,
  } = useDailyLog();

  const { dietPreset, loading, selectedDate } = state;

  const dateString = selectedDate.toISOString().slice(0, 10);

  // Format today date text like "Hôm nay, 17 Tháng 5"
  const getHeaderDateLabel = () => {
    const today = new Date();
    const isToday = today.toDateString() === selectedDate.toDateString();
    const prefix = isToday ? 'Hôm nay, ' : '';
    const formatted = selectedDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long' });
    return `${prefix}${formatted}`;
  };

  useEffect(() => {
    fetchUserTarget();
  }, []);

  useEffect(() => {
    fetchDailyOverview(dateString);
  }, [dateString]);

  // Handle saving macros ratio preset in Context
  const handleSaveDietPreset = (presetName, ratios) => {
    updateDietPreset(presetName, ratios);
  };

  // Generate 7 days of the current week centered around selectedDate
  const getDaysOfWeek = () => {
    const start = new Date(selectedDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(start.setDate(diff));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const daysOfWeek = getDaysOfWeek();

  return (
    <div className="flex flex-col min-h-full pb-10 text-white bg-transparent">
      <DiaryHeader 
        getHeaderDateLabel={getHeaderDateLabel} 
        loading={loading} 
        setSelectedDate={setSelectedDate} 
        Calendar={Calendar}
      />

      <DatePicker 
        daysOfWeek={daysOfWeek} 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
      />

      <NutritionCard 
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <div className="px-8 mb-8">
        <DietSection
          currentPreset={dietPreset.name}
          currentRatios={dietPreset}
          onSavePreset={handleSaveDietPreset}
        />
      </div>
    </div>
  );
};

export default Diary;
