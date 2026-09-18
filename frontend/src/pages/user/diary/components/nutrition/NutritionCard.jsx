import React from 'react';
import { useDailyLog } from '../../../../../providers/user';
import StomachIcon from './StomachIcon';
import BatteryInfo from './BatteryInfo';
import CircularMacro from './CircularMacro';
import WeeklyView from './WeeklyView';

const NutritionCard = ({ viewMode, setViewMode }) => {
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
    // GIAO DIỆN NUTRITION CARD
    <div className="px-8 mb-8">
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight">Calo & Dinh dưỡng</h2>
          <div className="bg-zinc-800/80 rounded-xl flex p-1 border border-zinc-700/50">
            <button
              onClick={() => setViewMode('day')}
              className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'day' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
            >
              Ngày
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'week' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-400 hover:text-white'
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

export default NutritionCard;
