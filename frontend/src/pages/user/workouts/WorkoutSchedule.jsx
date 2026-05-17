/**
 * Tác dụng của file: Hiển thị giao diện lịch tập luyện theo ngày/tháng và thời gian
 * File này dùng cho component cha nào là chính: Workouts (src/pages/user/workouts/index.jsx)
 */
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, ChevronDown, Plus } from 'lucide-react';

const WorkoutSchedule = ({ setView }) => {
  const days = [
    { day: 'CN', date: 20 },
    { day: 'T2', date: 21 },
    { day: 'T3', date: 22 },
    { day: 'T4', date: 23 },
    { day: 'T5', date: 24 },
    { day: 'T6', date: 25 },
    { day: 'T7', date: 26 },
  ];

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
              <ChevronLeft size={24} className="text-[#c8f31d] cursor-pointer" />
              <div className="text-center">
                <div className="text-lg">Tháng 02</div>
                <div className="text-sm text-[#c8f31d]">2025</div>
              </div>
              <ChevronRight size={24} className="text-[#c8f31d] cursor-pointer" />
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {days.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center min-w-[76px] py-4 rounded-[20px] cursor-pointer transition-colors ${
                  item.date === 20
                    ? 'bg-[#c8f31d] text-black shadow-lg'
                    : 'border border-[#c8f31d] text-[#c8f31d] bg-transparent'
                }`}
              >
                <span className={`text-base mb-2 ${item.date === 20 ? 'font-medium' : 'font-normal'}`}>
                  {item.day}
                </span>
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold ${
                    item.date === 20 ? 'bg-white text-black' : 'bg-white text-black'
                  }`}
                >
                  {item.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Section */}
        <div className="mt-10 mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl">
            <Clock size={24} className="text-[#c8f31d]" />
            Thời gian
          </div>
          <div className="border border-[#c8f31d] rounded-2xl px-5 py-3 flex items-center gap-4 cursor-pointer">
            <span className="font-bold text-lg tracking-wide">05:44 AM</span>
            <ChevronDown size={24} className="text-[#c8f31d]" />
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
