import React, { useState } from 'react';
import { ArrowLeft, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const DetailHeader = ({ setView }) => (
  <div className="px-8 pt-8 pb-4 flex items-center gap-4">
    <button
      onClick={() => setView('search')}
      className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white hover:bg-zinc-700 transition-colors shadow-inner"
    >
      <ArrowLeft size={24} />
    </button>
    <h2 className="text-2xl font-black">Chi tiết bài tập</h2>
  </div>
);

const ExerciseInfo = ({ selectedExercise }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 mb-8 border border-zinc-800 flex flex-col gap-4 shadow-lg">
      <div className="flex items-start gap-5">
        <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center text-4xl shadow-inner overflow-hidden shrink-0">
          {selectedExercise?.img && (selectedExercise.img.startsWith('http') || selectedExercise.img.startsWith('/')) ? (
            <img src={selectedExercise.img} alt={selectedExercise.name} className="w-full h-full object-cover" />
          ) : (
            selectedExercise?.img || '🏋️'
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-white mb-2 leading-tight">{selectedExercise?.name}</h3>
          <p className="text-zinc-400 font-bold uppercase tracking-wider text-xs mb-2">{selectedExercise?.type}</p>
          {selectedExercise?.muscles && selectedExercise.muscles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedExercise.muscles.map((m, i) => (
                <span key={i} className="text-[10px] font-extrabold text-[#c8f31d] bg-[#c8f31d]/10 px-2 py-1 rounded-md uppercase tracking-wider">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {Array.isArray(selectedExercise?.instructions) && selectedExercise.instructions.length > 0 && (
        <div className="mt-2 border-t border-zinc-800 pt-4">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="flex items-center gap-2 text-[#c8f31d] hover:text-white transition-colors text-sm font-bold tracking-wide"
          >
            Hướng dẫn {showInstructions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showInstructions && (
            <div className="mt-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 max-h-40 overflow-y-auto custom-scrollbar">
              <ol className="list-decimal list-inside space-y-2 text-sm text-zinc-300">
                {selectedExercise.instructions.map((step, idx) => (
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

const ModeSelection = ({ exerciseMode, setExerciseMode }) => (
  <div className="bg-zinc-900 p-2 rounded-2xl flex gap-2 shadow-inner border border-zinc-800">
    <button
      onClick={() => setExerciseMode('reps')}
      className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${exerciseMode === 'reps' ? 'bg-[#c8f31d] text-black shadow-md' : 'text-zinc-400 hover:text-white'
        }`}
    >
      Số Reps
    </button>
    <button
      onClick={() => setExerciseMode('time')}
      className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${exerciseMode === 'time' ? 'bg-[#c8f31d] text-black shadow-md' : 'text-zinc-400 hover:text-white'
        }`}
    >
      Thời gian
    </button>
  </div>
);

const StepperInput = ({ label, value, setValue, unit, icon }) => {
  const handleDecrement = () => setValue(Math.max(1, Number(value) - 1));
  const handleIncrement = () => setValue(Number(value) + 1);

  return (
    <div>
      <label className="text-zinc-400 font-bold uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
        {icon && icon} {label}
      </label>
      <div className="flex items-center justify-center gap-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-2 shadow-inner w-fit">
        <button
          onClick={handleDecrement}
          className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors shrink-0"
        >
          -
        </button>
        <div className="flex flex-col items-center justify-center py-1 w-20">
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Math.max(1, Number(e.target.value)))}
            className="w-full bg-transparent text-center text-white text-2xl font-black focus:outline-none"
          />
          <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
            {unit}
          </span>
        </div>
        <button
          onClick={handleIncrement}
          className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl font-bold text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors shrink-0"
        >
          +
        </button>
      </div>
    </div>
  );
};

const FormInputs = ({ exerciseMode, sets, setSets, repsOrTime, setRepsOrTime, restTime, setRestTime }) => (
  <div className="space-y-3">
    <StepperInput
      label="Số Sets"
      value={sets}
      setValue={setSets}
      unit="Sets"
    />

    <StepperInput
      label={exerciseMode === 'reps' ? 'Số Reps mỗi Set' : 'Thời gian mỗi Set'}
      value={repsOrTime}
      setValue={setRepsOrTime}
      unit={exerciseMode === 'reps' ? 'Reps' : 'Giây'}
    />

    <StepperInput
      label="Thời gian nghỉ giữa các Set"
      value={restTime}
      setValue={setRestTime}
      unit="Giây"
      icon={<Clock size={18} />}
    />
  </div>
);

const SummaryBlock = ({ exerciseMode, sets, repsOrTime, restTime }) => {
  const totalRest = (sets - 1) * restTime;
  const isTimeMode = exerciseMode === 'time';
  const totalWork = sets * Number(repsOrTime);

  return (
    <div className="bg-[#c8f31d]/10 border border-[#c8f31d]/20 rounded-2xl p-6 h-full flex flex-col justify-center shadow-lg">
      <h4 className="text-[#c8f31d] font-black uppercase tracking-wider text-sm mb-3">
        {isTimeMode ? 'Tổng thời gian bài tập' : 'Tổng reps'}
      </h4>
      <div className="space-y-1">
        {isTimeMode ? (
          <>
            <p className="text-white font-medium">{sets} sets × {repsOrTime} giây</p>
            <p className="text-zinc-400 text-sm">Nghỉ: {restTime} giây mỗi set</p>
            <p className="text-[#c8f31d] font-bold mt-2">Tổng: ~{Math.ceil((totalWork + totalRest) / 60)} phút</p>
          </>
        ) : (
          <p className="text-white font-medium text-lg">{sets} sets × {repsOrTime} reps = {totalWork} reps</p>
        )}
      </div>
    </div>
  );
};

const ActionButtons = ({ handleSaveToSchedule, setView }) => (
  <div className="flex gap-4 mt-8">
    <button
      onClick={() => setView('search')}
      className="flex-1 bg-transparent border-2 border-zinc-700 text-zinc-400 font-black py-5 rounded-2xl text-lg hover:bg-zinc-800 hover:text-white transition-colors"
    >
      Hủy
    </button>
    <button
      onClick={handleSaveToSchedule}
      className="flex-1 bg-[#c8f31d] text-black font-black py-5 rounded-2xl text-lg hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.2)]"
    >
      Lưu vào buổi tập
    </button>
  </div>
);

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
      <DetailHeader setView={setView} />

      <div className="flex-1 overflow-y-auto px-8 pb-20 scrollbar-hide animate-in slide-in-from-right-8 duration-300">
        <ExerciseInfo selectedExercise={selectedExercise} />

        <div className="space-y-8">
          <ModeSelection exerciseMode={exerciseMode} setExerciseMode={setExerciseMode} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInputs
              exerciseMode={exerciseMode}
              sets={sets}
              setSets={setSets}
              repsOrTime={repsOrTime}
              setRepsOrTime={setRepsOrTime}
              restTime={restTime}
              setRestTime={setRestTime}
            />

            <SummaryBlock
              exerciseMode={exerciseMode}
              sets={sets}
              repsOrTime={repsOrTime}
              restTime={restTime}
            />
          </div>

          <ActionButtons handleSaveToSchedule={handleSaveToSchedule} setView={setView} />
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetail;
