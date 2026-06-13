import { useWorkout } from '../../../providers/user/workout';
import { ArrowLeft, Dumbbell, Trash2 } from 'lucide-react';

const ListHeader = ({ setWorkoutView }) => (
  <div className="flex items-center gap-4 px-6 pt-8 pb-6">
    <button onClick={() => setWorkoutView('schedule')} className="text-white hover:text-[#c8f31d] transition-colors">
      <ArrowLeft size={28} />
    </button>
    <h1 className="text-3xl font-medium tracking-wide">Bài tập đã thêm</h1>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-zinc-500 flex-1">
    <Dumbbell size={64} className="mb-4 opacity-20" />
    <p className="font-bold text-lg">Chưa có bài tập nào</p>
  </div>
);

const ExerciseListItems = ({ scheduledExercises, setScheduledExercises }) => {
  const handleRemove = (indexToRemove) => {
    setScheduledExercises(scheduledExercises.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4 mb-8">
      {scheduledExercises.map((item, idx) => (
        <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex items-center gap-4 shadow-lg">
          <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl overflow-hidden shrink-0">
            {item.img && (item.img.startsWith('http') || item.img.startsWith('/')) ? (
              <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              item.img || '🏋️'
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-lg text-white mb-1 truncate">{item.name}</h3>
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
          <button
            onClick={() => handleRemove(idx)}
            className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-500 hover:bg-red-500/20 hover:text-red-500 transition-all shrink-0"
            title="Xóa bài tập"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

const StartWorkoutButton = ({ scheduledExercises, setCurrentExerciseIndex, setWorkoutView }) => (
  <div className="mt-auto">
    <button
      onClick={() => {
        if (scheduledExercises.length > 0) {
          setCurrentExerciseIndex(0);
          setWorkoutView('session');
        }
      }}
      disabled={scheduledExercises.length === 0}
      className={`w-full font-black py-5 rounded-[20px] text-xl transition-transform tracking-wide ${scheduledExercises.length > 0
        ? 'bg-[#c8f31d] text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(200,243,29,0.15)]'
        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }`}
    >
      Bắt đầu tập luyện
    </button>
  </div>
);

const WorkoutList = () => {
  const { state, setWorkoutView, setCurrentExerciseIndex, setScheduledExercises } = useWorkout();
  const { scheduledExercises } = state;

  return (
    <div className="h-full bg-[#050505] text-white relative font-sans overflow-hidden flex flex-col">
      <ListHeader setWorkoutView={setWorkoutView} />

      <div className="flex-1 overflow-y-auto px-6 pb-20 scrollbar-hide flex flex-col">
        {scheduledExercises.length === 0 ? (
          <EmptyState />
        ) : (
          <ExerciseListItems
            scheduledExercises={scheduledExercises}
            setScheduledExercises={setScheduledExercises}
          />
        )}

        <StartWorkoutButton
          scheduledExercises={scheduledExercises}
          setCurrentExerciseIndex={setCurrentExerciseIndex}
          setWorkoutView={setWorkoutView}
        />
      </div>
    </div>
  );
};

export default WorkoutList;
