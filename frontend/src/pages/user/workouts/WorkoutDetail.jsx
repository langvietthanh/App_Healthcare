/**
 * Tác dụng của file: Hiển thị giao diện cấu hình chi tiết bài tập (chọn chế độ Reps/Time, số Sets, số lượng cụ thể và thời gian nghỉ)
 * File này dùng cho component cha nào là chính: Workouts (src/pages/user/workouts/index.jsx)
 */
import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

const WorkoutDetail = ({
  setView,
  selectedExercise,
  exerciseMode,
  setExerciseMode,
  sets,
  setSets,
  repsOrTime,
  setRepsOrTime,
  restTime,
  setRestTime,
  handleSaveToSchedule,
}) => {
  return (
    <div className="h-full bg-[#111] text-white relative font-sans overflow-hidden flex flex-col">
      <div className="px-8 pt-8 pb-4 flex items-center gap-4">
        <button
          onClick={() => setView('search')}
          className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white hover:bg-zinc-700 transition-colors shadow-inner"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-black">Chi tiết bài tập</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-20 scrollbar-hide animate-in slide-in-from-right-8 duration-300">
        <div className="bg-zinc-900 rounded-3xl p-6 mb-8 border border-zinc-800 flex items-center gap-5 shadow-lg">
          <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
            {selectedExercise?.img}
          </div>
          <div>
            <h3 className="text-2xl font-black text-white mb-1">{selectedExercise?.name}</h3>
            <p className="text-zinc-400 font-bold uppercase tracking-wider text-xs">{selectedExercise?.type}</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Mode Selection */}
          <div className="bg-zinc-900 p-2 rounded-2xl flex gap-2 shadow-inner border border-zinc-800">
            <button
              onClick={() => setExerciseMode('reps')}
              className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${
                exerciseMode === 'reps' ? 'bg-[#c8f31d] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Số Reps
            </button>
            <button
              onClick={() => setExerciseMode('time')}
              className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${
                exerciseMode === 'time' ? 'bg-[#c8f31d] text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Thời gian
            </button>
          </div>

          {/* Form Inputs */}
          <div className="space-y-6">
            <div>
              <label className="text-zinc-400 font-bold uppercase tracking-wider text-sm mb-3 block">Số Sets</label>
              <div className="relative">
                <input
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4.5 px-5 text-white text-xl font-black focus:outline-none focus:border-[#c8f31d] shadow-inner"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold uppercase tracking-wider">
                  Sets
                </span>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 font-bold uppercase tracking-wider text-sm mb-3 block">
                {exerciseMode === 'reps' ? 'Số Reps mỗi Set' : 'Thời gian mỗi Set'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={repsOrTime}
                  onChange={(e) => setRepsOrTime(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4.5 px-5 text-white text-xl font-black focus:outline-none focus:border-[#c8f31d] shadow-inner"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold uppercase tracking-wider">
                  {exerciseMode === 'reps' ? 'Reps' : 'Giây'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-zinc-400 font-bold uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
                <Clock size={18} /> Thời gian nghỉ giữa các Set
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={restTime}
                  onChange={(e) => setRestTime(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4.5 px-5 text-white text-xl font-black focus:outline-none focus:border-[#c8f31d] shadow-inner"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold uppercase tracking-wider">
                  Giây
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveToSchedule}
            className="w-full bg-[#c8f31d] text-black font-black py-4.5 rounded-2xl text-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.2)] mt-8"
          >
            Lưu vào lịch tập
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
