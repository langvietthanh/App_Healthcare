import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, ChevronDown, Plus, History, BookmarkCheck } from 'lucide-react';
import { useWorkout } from '../../../store';

// Helper: so sánh ngày (bỏ phần giờ)
const toMidnight = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getDateType = (selectedDate) => {
  const today = toMidnight(new Date());
  const sel = toMidnight(selectedDate);
  if (sel < today) return 'past';
  if (sel.getTime() === today.getTime()) return 'today';
  return 'future';
};

const ScheduleHeader = ({ dateType }) => {
  const labels = {
    past: 'Lịch sử tập luyện',
    today: 'Lên lịch bài tập',
    future: 'Lên lịch bài tập',
  };
  return (
    <div className="flex items-center justify-between px-6 pt-8 pb-4">
      <h1 className="text-3xl font-medium tracking-wide">{labels[dateType]}</h1>
      {dateType === 'today' && (
        <span className="text-xs font-bold bg-[#c8f31d] text-black px-3 py-1 rounded-full uppercase tracking-wider">
          Hôm nay
        </span>
      )}
      {dateType === 'past' && (
        <span className="text-xs font-bold bg-zinc-700 text-zinc-400 px-3 py-1 rounded-full uppercase tracking-wider">
          Đã qua
        </span>
      )}
      {dateType === 'future' && (
        <span className="text-xs font-bold bg-blue-900/60 text-blue-300 px-3 py-1 rounded-full uppercase tracking-wider">
          Sắp tới
        </span>
      )}
    </div>
  );
};

const DateSection = ({ selectedDate, changeWeek, currentMonth, currentYear, days, setWorkoutSelectedDate }) => {
  const today = toMidnight(new Date());

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 font-bold text-xl">
          <Calendar size={24} className="text-[#c8f31d]" />
          Ngày
        </div>
        <div className="flex items-center gap-4 font-bold">
          <ChevronLeft
            size={24}
            className="text-[#c8f31d] cursor-pointer hover:scale-110 transition-transform"
            onClick={() => changeWeek(-1)}
          />
          <div className="text-center w-20">
            <div className="text-lg">{currentMonth}</div>
            <div className="text-sm text-[#c8f31d]">{currentYear}</div>
          </div>
          <ChevronRight
            size={24}
            className="text-[#c8f31d] cursor-pointer hover:scale-110 transition-transform"
            onClick={() => changeWeek(1)}
          />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {days.map((item, idx) => {
          const isSelected = item.fullDate.toDateString() === selectedDate.toDateString();
          const isPast = toMidnight(item.fullDate) < today;
          const isToday = toMidnight(item.fullDate).getTime() === today.getTime();

          let baseStyle = '';
          if (isSelected) {
            baseStyle = isPast
              ? 'bg-zinc-600 text-zinc-300 shadow-md scale-105 opacity-80'
              : 'bg-[#c8f31d] text-black shadow-lg scale-105';
          } else if (isPast) {
            baseStyle = 'border border-zinc-700 text-zinc-600 bg-transparent opacity-50 cursor-pointer hover:opacity-70';
          } else {
            baseStyle = 'border border-[#c8f31d] text-[#c8f31d] bg-transparent hover:bg-zinc-900 cursor-pointer';
          }

          return (
            <div
              key={idx}
              onClick={() => setWorkoutSelectedDate(item.fullDate)}
              className={`flex flex-col items-center justify-center min-w-[76px] py-4 rounded-[20px] transition-all ${baseStyle}`}
            >
              <span className={`text-base mb-2 ${isSelected ? 'font-medium' : 'font-normal'}`}>
                {item.day}
              </span>
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold relative ${
                  isSelected
                    ? 'bg-white text-black shadow-inner'
                    : isPast
                    ? 'bg-zinc-800 text-zinc-500'
                    : 'bg-white text-black'
                }`}
              >
                {item.date}
                {isToday && !isSelected && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#c8f31d] rounded-full" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TimeSection = ({ selectedTime, setWorkoutSelectedTime, dateType }) => {
  if (dateType === 'past') return null;

  return (
    <div className="mt-10 mb-12 flex items-center justify-between">
      <div className="flex items-center gap-3 font-bold text-xl">
        <Clock size={24} className="text-[#c8f31d]" />
        Thời gian
      </div>
      <div className="border border-[#c8f31d] rounded-2xl px-5 py-3 flex items-center gap-4 cursor-pointer relative hover:bg-zinc-900 transition-colors">
        <input
          type="time"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            if (e.target.value) {
              const [h, m] = e.target.value.split(':');
              const dateObj = new Date();
              dateObj.setHours(h, m);
              setWorkoutSelectedTime(dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
            }
          }}
        />
        <span className="font-bold text-lg tracking-wide pointer-events-none">{selectedTime}</span>
        <ChevronDown size={24} className="text-[#c8f31d] pointer-events-none" />
      </div>
    </div>
  );
};

// Các bộ nút theo từng trạng thái ngày
const TodayButtons = ({ setView, scheduledExercises }) => {
  const hasData = scheduledExercises && scheduledExercises.length > 0;
  return (
    <div className="mt-auto flex flex-col gap-3">
      <div className="flex gap-4">
        <button
          onClick={() => setView('list')}
          className="flex-1 bg-[#c8f31d] text-black font-black py-5 rounded-[20px] text-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.15)] tracking-wide"
        >
          Bắt đầu tập
        </button>
        <button
          onClick={() => setView('search')}
          className="flex-1 bg-transparent border-2 border-zinc-700 text-[#c8f31d] font-black py-5 rounded-[20px] text-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all flex justify-center items-center gap-2"
        >
          <Plus size={24} strokeWidth={3} />
          Thêm bài tập
        </button>
      </div>
      <button
        disabled={!hasData}
        className={`w-full font-bold py-3.5 rounded-[20px] text-base transition-all flex justify-center items-center gap-2 ${
          hasData
            ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-600'
            : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
        }`}
      >
        <History size={18} />
        Xem lịch sử hôm nay
      </button>
    </div>
  );
};

const FutureButtons = ({ setView }) => (
  <div className="mt-auto flex gap-4">
    <button
      className="flex-1 bg-[#c8f31d] text-black font-black py-5 rounded-[20px] text-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.15)] tracking-wide flex justify-center items-center gap-2"
    >
      <BookmarkCheck size={22} />
      Lưu lịch
    </button>
    <button
      onClick={() => setView('search')}
      className="flex-1 bg-transparent border-2 border-zinc-700 text-[#c8f31d] font-black py-5 rounded-[20px] text-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all flex justify-center items-center gap-2"
    >
      <Plus size={24} strokeWidth={3} />
      Thêm bài tập
    </button>
  </div>
);

const PastButtons = ({ scheduledExercises }) => {
  const hasData = scheduledExercises && scheduledExercises.length > 0;

  return (
    <div className="mt-auto flex flex-col gap-4">
      {!hasData && (
        <div className="flex flex-col items-center justify-center py-8 text-zinc-600 gap-2">
          <History size={40} className="opacity-40" />
          <p className="font-bold text-base">Ngày này đã qua</p>
          <p className="text-sm text-zinc-700">Không có dữ liệu tập luyện</p>
        </div>
      )}
      <button
        disabled={!hasData}
        className={`w-full font-black py-5 rounded-[20px] text-xl transition-all flex justify-center items-center gap-2 ${
          hasData
            ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-600'
            : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
        }`}
      >
        <History size={22} />
        Xem lịch sử
      </button>
    </div>
  );
};

const WorkoutSchedule = ({ setView, scheduledExercises }) => {
  const { state, setWorkoutSelectedDate, setWorkoutSelectedTime } = useWorkout();
  const { selectedDate, selectedTime } = state;

  const dateType = getDateType(selectedDate);

  const getDaysOfWeek = () => {
    const start = new Date(selectedDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diff));

    const days = [];
    const dayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({
        day: dayLabels[d.getDay()],
        date: d.getDate(),
        fullDate: d
      });
    }
    return days;
  };

  const days = getDaysOfWeek();
  const currentMonth = `Tháng ${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
  const currentYear = selectedDate.getFullYear();

  const changeWeek = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset * 7);
    setWorkoutSelectedDate(newDate);
  };

  return (
    <div className="h-full bg-[#050505] text-white relative font-sans overflow-hidden flex flex-col">
      <ScheduleHeader dateType={dateType} />

      <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide flex flex-col">
        <DateSection
          selectedDate={selectedDate}
          changeWeek={changeWeek}
          currentMonth={currentMonth}
          currentYear={currentYear}
          days={days}
          setWorkoutSelectedDate={setWorkoutSelectedDate}
        />

        <TimeSection
          selectedTime={selectedTime}
          setWorkoutSelectedTime={setWorkoutSelectedTime}
          dateType={dateType}
        />

        {dateType === 'today' && <TodayButtons setView={setView} scheduledExercises={scheduledExercises} />}
        {dateType === 'future' && <FutureButtons setView={setView} />}
        {dateType === 'past' && <PastButtons scheduledExercises={scheduledExercises} />}
      </div>
    </div>
  );
};

export default WorkoutSchedule;
