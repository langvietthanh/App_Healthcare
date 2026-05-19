/**
 * Tác dụng của file: Hiển thị danh sách các bài tập đã thêm vào lịch tập hôm nay
 * File này dùng cho component cha nào là chính: Workouts (src/pages/user/workouts/index.jsx)
 */
import React from 'react';
import { ArrowLeft, Dumbbell } from 'lucide-react';

const WorkoutList = ({ setView, scheduledExercises, setCurrentExerciseIndex }) => {
  return (
    <div className="h-full bg-[#050505] text-white relative font-sans overflow-hidden flex flex-col">
      <div className="flex items-center gap-4 px-6 pt-8 pb-6">
        <button onClick={() => setView('schedule')} className="text-white hover:text-[#c8f31d] transition-colors">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-3xl font-medium tracking-wide">Bài tập đã thêm</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide flex flex-col">
        {scheduledExercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 flex-1">
            <Dumbbell size={64} className="mb-4 opacity-20" />
            <p className="font-bold text-lg">Chưa có bài tập nào</p>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {scheduledExercises.map((item, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex items-center gap-4 shadow-lg">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl overflow-hidden">
                  {item.img && (item.img.startsWith('http') || item.img.startsWith('/')) ? (
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.img || '🏋️'
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg text-white mb-1">{item.name}</h3>
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-400 flex-wrap">
                    <span>{item.sets} Sets</span>
                    <span>•</span>
                    <span>{item.repsOrTime} {item.mode === 'reps' ? 'Reps' : 'Giây'}</span>
                    {item.muscles && item.muscles.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-[#c8f31d]">{item.muscles.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto">
          <button
            onClick={() => {
              if (scheduledExercises.length > 0) {
                setCurrentExerciseIndex(0);
                setView('session');
              }
            }}
            disabled={scheduledExercises.length === 0}
            className={`w-full font-black py-5 rounded-[20px] text-xl transition-transform tracking-wide ${
              scheduledExercises.length > 0
                ? 'bg-[#c8f31d] text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(200,243,29,0.15)]'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            Bắt đầu tập luyện
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutList;
