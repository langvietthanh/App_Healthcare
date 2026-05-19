/**
 * Tác dụng của file: Hiển thị giao diện buổi luyện tập đang diễn ra với đồng hồ đếm ngược và thông tin bài kế tiếp
 * File này dùng cho component cha nào là chính: Workouts (src/pages/user/workouts/index.jsx)
 */
import React from 'react';
import { ChevronLeft } from 'lucide-react';

const WorkoutSession = ({
  setView,
  scheduledExercises,
  currentExerciseIndex,
  setCurrentExerciseIndex,
}) => {
  const currentEx = scheduledExercises[currentExerciseIndex] || scheduledExercises[0];
  const nextEx = scheduledExercises[currentExerciseIndex + 1];

  if (!currentEx) return null;

  return (
    <div className="h-full bg-[#111] text-white relative font-sans overflow-hidden flex flex-col">
      {/* Top Image Half */}
      <div className="h-1/2 relative rounded-b-[40px] overflow-hidden shrink-0 shadow-2xl bg-zinc-900 flex items-center justify-center">
        {currentEx.img && (currentEx.img.startsWith('http') || currentEx.img.startsWith('/')) ? (
          <img src={currentEx.img} alt={currentEx.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[120px] mb-8">{currentEx.img || '🏋️'}</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/20 to-black/60 pointer-events-none"></div>

        <button
          onClick={() => setView('list')}
          className="absolute top-8 left-6 text-[#c8f31d] hover:text-white transition-colors"
        >
          <ChevronLeft size={36} strokeWidth={3} />
        </button>
      </div>

      {/* Info & Timer */}
      <div className="flex-1 px-8 pt-6 flex flex-col">
        <div className="mb-4 text-left">
          <p className="text-[#c8f31d] font-bold text-xs mb-2 tracking-widest uppercase">
            Exercise {currentExerciseIndex + 1}/{scheduledExercises.length}
          </p>
          <h2 className="text-3xl font-medium tracking-wide leading-tight">{currentEx.name}</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-4">
          {/* Circular Timer Mock */}
          <div className="relative w-40 h-40 rounded-full border-8 border-zinc-800 flex flex-col items-center justify-center mb-4 shadow-inner">
            <div className="absolute inset-[-8px] rounded-full border-8 border-[#c8f31d] border-t-transparent border-r-transparent -rotate-45 transition-all"></div>
            <span className="text-3xl font-bold tracking-wider">
              {currentEx.mode === 'reps' ? (
                `${currentEx.repsOrTime} Reps`
              ) : (
                `00:${currentEx.repsOrTime < 10 ? `0${currentEx.repsOrTime}` : currentEx.repsOrTime}`
              )}
            </span>
          </div>
          <p className="text-zinc-500 font-bold tracking-wider uppercase text-xs">
            {currentEx.mode === 'reps' ? 'Số lần thực hiện' : 'Thời gian mục tiêu'}
          </p>
        </div>

        <div className="flex gap-4 mt-2">
          <button className="flex-1 border-2 border-[#c8f31d] text-white font-bold py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-zinc-800 transition-colors">
            <div className="flex gap-1 items-center">
              <div className="w-1 h-3.5 bg-[#c8f31d] rounded-sm"></div>
              <div className="w-1 h-3.5 bg-[#c8f31d] rounded-sm"></div>
            </div>
            Stop
          </button>
          <button
            onClick={() => {
              if (nextEx) setCurrentExerciseIndex(currentExerciseIndex + 1);
              else setView('schedule');
            }}
            className="flex-[2] bg-[#c8f31d] text-black font-bold py-4 rounded-2xl flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform shadow-lg"
          >
            <span className="text-xl">🏃‍♂️</span> Next Training
          </button>
        </div>

        {/* Up Next */}
        <div className="mt-8 mb-6">
          <p className="font-bold mb-4 tracking-wide text-white">Up Next</p>
          {nextEx ? (
            <div className="flex items-center justify-between pb-2 border-b-2 border-zinc-500">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-xl overflow-hidden shrink-0 border border-zinc-700 flex items-center justify-center text-3xl">
                  {nextEx.img && (nextEx.img.startsWith('http') || nextEx.img.startsWith('/')) ? (
                    <img src={nextEx.img} alt={nextEx.name} className="w-full h-full object-cover" />
                  ) : (
                    nextEx.img || '🏋️'
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1 text-white">{nextEx.name}</h4>
                  {nextEx.muscles && nextEx.muscles.length > 0 && (
                    <p className="text-[11px] text-[#c8f31d] mt-1 font-bold truncate max-w-[150px]">
                      {nextEx.muscles.join(', ')}
                    </p>
                  )}
                  <p className="text-[11px] text-zinc-500 mt-1 font-bold">Beginner</p>
                </div>
              </div>
              {/* Small circular progress for next */}
              <div className="w-12 h-12 rounded-full border-4 border-zinc-800 flex items-center justify-center relative">
                <div className="absolute inset-[-4px] rounded-full border-4 border-[#c8f31d] border-t-transparent border-l-transparent rotate-45"></div>
                <span className="text-[9px] font-bold">00:19</span>
              </div>
            </div>
          ) : (
            <p className="text-zinc-500 text-sm italic">Bạn đã hoàn thành danh sách bài tập hôm nay!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutSession;
