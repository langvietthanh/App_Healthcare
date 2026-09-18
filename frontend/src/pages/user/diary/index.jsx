import { useState, useEffect } from 'react';
import { useDailyLog } from '../../../providers/user';

import DietSection from './components/diet/DietSection';
import DiaryHeader from './components/layout/DiaryHeader';
import DatePicker from './components/layout/DatePicker';
import NutritionCard from './components/nutrition/NutritionCard';

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

  const formatLocal = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const dateString = formatLocal(selectedDate);


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
    // GIAO DIỆN DIARY
    <div className="flex flex-col min-h-full pb-10 text-white bg-transparent">
      <DiaryHeader
        selectedDate={selectedDate}
        loading={loading}
        setSelectedDate={setSelectedDate}
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
