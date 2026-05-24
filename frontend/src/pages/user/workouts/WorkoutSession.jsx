import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';

const TopImage = ({ currentEx, setView }) => (
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
);

const ExerciseHeader = ({ currentEx, currentExerciseIndex, totalExercises }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    setShowInstructions(false);
  }, [currentExerciseIndex]);

  return (
    <div className="mb-4 text-left">
      <p className="text-[#c8f31d] font-bold text-xs mb-2 tracking-widest uppercase">
        Exercise {currentExerciseIndex + 1}/{totalExercises}
      </p>
      <h2 className="text-3xl font-medium tracking-wide leading-tight">{currentEx.name}</h2>

      {Array.isArray(currentEx.instructions) && currentEx.instructions.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center gap-2 text-[#c8f31d] hover:text-white transition-colors text-sm font-bold tracking-wide"
          >
            Hướng dẫn {showInstructions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showInstructions && (
            <div className="mt-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 max-h-40 overflow-y-auto custom-scrollbar">
              <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300">
                {currentEx.instructions.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RestTimer = ({ restTimeLeft, totalRestTime, addRestTime, skipRest, handleUndoSet }) => (
  <div className="flex flex-col items-center justify-center animate-pulse">
    <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke="#27272a" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="#c8f31d"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 46}
          strokeDashoffset={2 * Math.PI * 46 * (1 - restTimeLeft / totalRestTime)}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      <span className="text-5xl font-bold text-[#c8f31d] relative z-10">
        {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
      </span>
    </div>
    <p className="text-zinc-500 font-bold tracking-wider uppercase text-xs mb-6">
      Thời gian nghỉ
    </p>
    <div className="flex gap-4">
      <button onClick={addRestTime} className="px-4 py-2 border-2 border-[#c8f31d] text-[#c8f31d] rounded-xl font-bold hover:bg-zinc-800 transition-colors">
        +10s
      </button>
      <button onClick={skipRest} className="px-4 py-2 bg-[#c8f31d] text-black rounded-xl font-bold hover:scale-105 transition-transform">
        Tiếp tục tập
      </button>
    </div>
    <button
      onClick={handleUndoSet}
      className="mt-6 text-zinc-500 text-xs font-medium underline hover:text-white transition-colors"
    >
      Nhấn nhầm? Quay lại hiệp trước
    </button>
  </div>
);

const ExerciseTimer = ({ currentEx, totalSets, completedSets, handleSetComplete, handleUndoSet, exerciseTimeLeft }) => {
  const totalTime = Number(currentEx.repsOrTime) || 1;
  const displayTime = Math.ceil(exerciseTimeLeft);
  const progressOffset = currentEx.mode === 'time'
    ? 2 * Math.PI * 46 * (1 - exerciseTimeLeft / totalTime)
    : 0;

  return (
    <>
      <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="#27272a" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#c8f31d"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 46}
            strokeDashoffset={progressOffset}
            className={currentEx.mode === 'time' ? "transition-all duration-100 ease-linear" : ""}
          />
        </svg>
        <span className="text-3xl font-bold tracking-wider relative z-10">
          {currentEx.mode === 'reps' ? (
            `${currentEx.repsOrTime} Reps`
          ) : (
            `${Math.floor(displayTime / 60).toString().padStart(2, '0')}:${(displayTime % 60).toString().padStart(2, '0')}`
          )}
        </span>
      </div>
      <p className="text-zinc-500 font-bold tracking-wider uppercase text-xs mb-4">
        {currentEx.mode === 'reps' ? 'Số lần thực hiện' : 'Thời gian mục tiêu'}
      </p>
  
      <div className="flex gap-3 mt-2 flex-wrap justify-center">
        {Array.from({ length: totalSets }).map((_, idx) => {
          const isCompleted = idx < completedSets;
        return (
          <button
            key={idx}
            onClick={() => {
              if (idx === completedSets) {
                handleSetComplete();
              } else if (idx === completedSets - 1) {
                handleUndoSet();
              }
            }}
            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${isCompleted
              ? 'bg-[#c8f31d] border-[#c8f31d] text-black'
              : 'border-zinc-600 text-zinc-600 hover:border-[#c8f31d] hover:text-[#c8f31d]'
              }`}
          >
            {isCompleted ? '✓' : idx + 1}
          </button>
        );
      })}
      </div>
      <p className="text-zinc-500 text-[10px] mt-2 uppercase tracking-wider">
        Đánh dấu hoàn thành từng hiệp
      </p>
    </>
  );
};

const Controls = ({ isResting, currentEx, nextEx, currentExerciseIndex, setCurrentExerciseIndex, setView, isExercisePlaying, setIsExercisePlaying }) => (
  <div className="flex gap-4 mt-2">
    {currentEx.mode === 'time' && !isResting &&(
      <button 
        onClick={() => setIsExercisePlaying(!isExercisePlaying)}
        className="flex-1 border-2 border-[#c8f31d] text-white font-bold py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-zinc-800 transition-colors"
      >
        {isExercisePlaying ? (
          <>
            <div className="flex gap-1 items-center">
              <div className="w-1 h-3.5 bg-[#c8f31d] rounded-sm"></div>
              <div className="w-1 h-3.5 bg-[#c8f31d] rounded-sm"></div>
            </div>
            Stop
          </>
        ) : (
          <>
            <div className="w-0 h-0 border-t-[7px] border-t-transparent border-l-[10px] border-l-[#c8f31d] border-b-[7px] border-b-transparent"></div>
            Start
          </>
        )}
      </button>
    )}
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
);

const UpNext = ({ nextEx }) => (
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
            <p className="text-[11px] text-zinc-500 mt-1 font-bold">{nextEx.level || 'Beginner'}</p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-full border-4 border-zinc-800 flex items-center justify-center relative">
          <div className="absolute inset-[-4px] rounded-full border-4 border-[#c8f31d] border-t-transparent border-l-transparent rotate-45"></div>
          <span className="text-[9px] font-bold">
            {nextEx.mode === 'reps' ? (
              `${nextEx.repsOrTime}x`
            ) : (
              `00:${nextEx.repsOrTime < 10 ? `0${nextEx.repsOrTime}` : nextEx.repsOrTime}`
            )}
          </span>
        </div>
      </div>
    ) : (
      <p className="text-zinc-500 text-sm italic">Bạn đã hoàn thành danh sách bài tập hôm nay!</p>
    )}
  </div>
);

const ExerciseCompleteScreen = ({ currentEx, nextEx, currentExerciseIndex, totalExercises, onStartNext, onTakeRest }) => {
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (timeLeft === 0) {
      onStartNext();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onStartNext]);

  return (
    <div className="absolute inset-0 bg-zinc-900 z-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-[#c8f31d] rounded-full flex items-center justify-center mb-6">
        <span className="text-black text-4xl">✓</span>
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Exercise complete</h2>
      <p className="text-zinc-400 text-lg mb-8">{currentEx.name} done!</p>

      <div className="bg-zinc-800/50 rounded-2xl p-6 w-full max-w-sm mb-8 border border-zinc-700/50">
        <p className="text-[#c8f31d] font-bold text-sm mb-2 tracking-widest uppercase">
          Progress: {currentExerciseIndex + 1}/{totalExercises}
        </p>
        <p className="text-zinc-400 text-sm mb-1">Next:</p>
        <p className="text-white font-bold text-xl">{nextEx.name}</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={onStartNext}
          className="w-full bg-[#c8f31d] text-black font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-lg"
        >
          Start next ({timeLeft}s)
        </button>
        <button
          onClick={onTakeRest}
          className="w-full bg-zinc-800 text-white font-bold py-4 rounded-2xl hover:bg-zinc-700 transition-colors border border-zinc-700"
        >
          Take 30s rest
        </button>
      </div>
    </div>
  );
};

const WorkoutCompleteScreen = ({ totalExercises, workoutStartTime, setView }) => {
  const durationMinutes = Math.max(1, Math.floor((Date.now() - workoutStartTime) / 60000));

  return (
    <div className="absolute inset-0 bg-[#c8f31d] z-50 flex flex-col items-center justify-center p-8 text-center animate-in slide-in-from-bottom duration-500">
      <span className="text-6xl mb-6">🎉</span>
      <h2 className="text-4xl font-bold text-black mb-8 leading-tight">Workout<br />complete!</h2>

      <div className="bg-black/10 rounded-3xl p-8 w-full max-w-sm mb-12">
        <p className="text-black/60 font-bold uppercase tracking-widest text-sm mb-6">Summary</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-4xl font-bold text-black mb-1">{totalExercises}</p>
            <p className="text-black/60 font-medium text-sm">exercises</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-black mb-1">{durationMinutes}</p>
            <p className="text-black/60 font-medium text-sm">min</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-xl">
          View stats
        </button>
        <button
          onClick={() => setView('schedule')}
          className="w-full bg-transparent text-black font-bold py-4 rounded-2xl border-2 border-black/20 hover:bg-black/5 transition-colors"
        >
          Back home
        </button>
      </div>
    </div>
  );
};

const WorkoutSession = ({
  setView,
  scheduledExercises,
  currentExerciseIndex,
  setCurrentExerciseIndex,
  logExerciseEntry,
}) => {
  const currentEx = scheduledExercises[currentExerciseIndex] || scheduledExercises[0];
  const nextEx = scheduledExercises[currentExerciseIndex + 1];

  const totalSets = currentEx?.sets || 1;
  const [completedSets, setCompletedSets] = useState(0);

  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [totalRestTime, setTotalRestTime] = useState(1);

  const [workoutStatus, setWorkoutStatus] = useState('playing');
  const [workoutStartTime] = useState(Date.now());
  const shouldRestNext = useRef(false);

  const [exerciseTimeLeft, setExerciseTimeLeft] = useState(0);
  const [isExercisePlaying, setIsExercisePlaying] = useState(false);

  useEffect(() => {
    setCompletedSets(0);
    setWorkoutStatus('playing');
    if (shouldRestNext.current) {
      setIsResting(true);
      setRestTimeLeft(30);
      setTotalRestTime(30);
      shouldRestNext.current = false;
    } else {
      setIsResting(false);
      setRestTimeLeft(0);
      setTotalRestTime(1);
    }
  }, [currentExerciseIndex]);

  useEffect(() => {
    let timer;
    if (isResting && restTimeLeft > 0) {
      timer = setInterval(() => {
        setRestTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isResting && restTimeLeft <= 0) {
      setIsResting(false);
    }
    return () => clearInterval(timer);
  }, [isResting, restTimeLeft]);

  useEffect(() => {
    if (!isResting && currentEx?.mode === 'time') {
      setExerciseTimeLeft(Number(currentEx.repsOrTime) || 0);
      setIsExercisePlaying(true);
    }
  }, [currentExerciseIndex, isResting, currentEx]);

  const handleSetCompleteRef = useRef(null);
  useEffect(() => {
    handleSetCompleteRef.current = handleSetComplete;
  });

  useEffect(() => {
    let timer;
    if (isExercisePlaying) {
      timer = setInterval(() => {
        setExerciseTimeLeft(prev => {
          const next = prev - 0.1;
          if (next <= 0.05) {
            setIsExercisePlaying(false);
            if (handleSetCompleteRef.current) handleSetCompleteRef.current();
            return Number(currentEx?.repsOrTime) || 0;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isExercisePlaying, currentEx]);

  const handleSetComplete = () => {
    if (completedSets < totalSets) {
      const newCompleted = completedSets + 1;
      setCompletedSets(newCompleted);
      if (newCompleted < totalSets) {
        setIsResting(true);
        const rest = currentEx.restTime || 30;
        setRestTimeLeft(rest);
        setTotalRestTime(rest);
      } else {
        if (nextEx) {
          setWorkoutStatus('exercise_complete');
        } else {
          // Lưu bài tập cuối cùng vào DB trước khi hiển thị màn hình chúc mừng
          logExerciseEntry(currentEx);
          setWorkoutStatus('workout_complete');
        }
      }
    }
  };

  const handleUndoSet = () => {
    if (completedSets > 0) {
      setCompletedSets(prev => prev - 1);
      setIsResting(false);
      setRestTimeLeft(0);
      if (currentEx?.mode === 'time') {
        setExerciseTimeLeft(Number(currentEx.repsOrTime) || 0);
        setIsExercisePlaying(true);
      }
    }
  };

  const addRestTime = () => {
    setRestTimeLeft((prev) => prev + 10);
    setTotalRestTime((prev) => prev + 10);
  };

  const skipRest = () => setIsResting(false);

  if (!currentEx) return null;

  return (
    <div className="h-full bg-[#111] text-white relative font-sans overflow-hidden flex flex-col">
      {workoutStatus === 'exercise_complete' && nextEx && (
        <ExerciseCompleteScreen
          currentEx={currentEx}
          nextEx={nextEx}
          currentExerciseIndex={currentExerciseIndex}
          totalExercises={scheduledExercises.length}
          onStartNext={() => {
            logExerciseEntry(currentEx);
            setCurrentExerciseIndex(currentExerciseIndex + 1);
          }}
          onTakeRest={() => {
            logExerciseEntry(currentEx);
            shouldRestNext.current = true;
            setCurrentExerciseIndex(currentExerciseIndex + 1);
          }}
        />
      )}
      {workoutStatus === 'workout_complete' && (
        <WorkoutCompleteScreen
          totalExercises={scheduledExercises.length}
          workoutStartTime={workoutStartTime}
          setView={setView}
        />
      )}

      <TopImage currentEx={currentEx} setView={setView} />

      <div className="flex-1 px-8 pt-6 flex flex-col">
        <ExerciseHeader
          currentEx={currentEx}
          currentExerciseIndex={currentExerciseIndex}
          totalExercises={scheduledExercises.length}
        />

        <div className="flex-1 flex flex-col items-center justify-center py-4">
          {isResting ? (
            <RestTimer
              restTimeLeft={restTimeLeft}
              totalRestTime={totalRestTime}
              addRestTime={addRestTime}
              skipRest={skipRest}
              handleUndoSet={handleUndoSet}
            />
          ) : (
            <ExerciseTimer
              currentEx={currentEx}
              totalSets={totalSets}
              completedSets={completedSets}
              handleSetComplete={handleSetComplete}
              handleUndoSet={handleUndoSet}
              exerciseTimeLeft={exerciseTimeLeft}
            />
          )}
        </div>

        <Controls
          isResting={isResting}
          currentEx={currentEx}
          nextEx={nextEx}
          currentExerciseIndex={currentExerciseIndex}
          setCurrentExerciseIndex={setCurrentExerciseIndex}
          setView={setView}
          isExercisePlaying={isExercisePlaying}
          setIsExercisePlaying={setIsExercisePlaying}
        />

        <UpNext nextEx={nextEx} />
      </div>
    </div>
  );
};

export default WorkoutSession;
