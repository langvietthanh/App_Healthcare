/**
 * Tác dụng của file: Hiển thị giao diện lịch tập luyện theo ngày/tháng và thời gian
 * File này dùng cho component cha nào là chính: Workouts (src/pages/user/workouts/index.jsx)
 */
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, ChevronDown, Plus } from 'lucide-react';
import { useWorkout } from '../../../store';

const WorkoutSchedule = ({ setView }) => {
  const { state, setWorkoutSelectedDate, setWorkoutSelectedTime } = useWorkout();
  const { selectedDate, selectedTime } = state;


  // Sinh ra 7 ngày của tuần hiện tại (bắt đầu từ Thứ 2)
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

  // Đổi tuần
  const changeWeek = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + offset * 7);
    setWorkoutSelectedDate(newDate);
  };

  return (
    <div className="h-full bg-[#050505] text-white relative font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4">
        <h1 className="text-3xl font-medium tracking-wide">Lên lịch bài tập</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide">
        {/* Date Section */}
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
              return (
                <div
                  key={idx}
                  onClick={() => setWorkoutSelectedDate(item.fullDate)}
                  className={`flex flex-col items-center justify-center min-w-[76px] py-4 rounded-[20px] cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#c8f31d] text-black shadow-lg scale-105'
                      : 'border border-[#c8f31d] text-[#c8f31d] bg-transparent hover:bg-zinc-900'
                  }`}
                >
                  <span className={`text-base mb-2 ${isSelected ? 'font-medium' : 'font-normal'}`}>
                    {item.day}
                  </span>
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold ${
                      isSelected ? 'bg-white text-black shadow-inner' : 'bg-white text-black'
                    }`}
                  >
                    {item.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Section */}
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
                 if(e.target.value) {
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

        <div className="mt-auto flex gap-4">
          <button
            onClick={() => setView('list')}
            className="flex-1 bg-[#c8f31d] text-black font-black py-5 rounded-[20px] text-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.15)] tracking-wide"
          >
            Hoàn tất
          </button>
          <button
            onClick={() => setView('search')}
            className="flex-1 bg-transparent border-2 border-zinc-700 text-[#c8f31d] font-black py-5 rounded-[20px] text-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all flex justify-center items-center gap-2"
          >
            <Plus size={24} strokeWidth={3} />
            Thêm bài tập
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSchedule;
