import { useState } from 'react';
import { Search, Filter, Star, Plus, ArrowLeft, Clock, Dumbbell, X, Calendar, ChevronLeft, ChevronRight, Bell, ChevronDown } from 'lucide-react';

const Workouts = () => {
  // Navigation State
  const [view, setView] = useState('schedule'); // 'schedule' | 'search' | 'detail'
  
  // Search State
  const [activeTab, setActiveTab] = useState('Cardio');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [ratingFilter, setRatingFilter] = useState({ min: '', max: '' });
  const [isCustom, setIsCustom] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Detail State
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseMode, setExerciseMode] = useState('reps'); // 'reps' | 'time'
  const [sets, setSets] = useState(3);
  const [repsOrTime, setRepsOrTime] = useState(12);
  const [restTime, setRestTime] = useState(30);

  // Schedule State (Mock)
  const [scheduledExercises, setScheduledExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  const tabs = ['Cardio', 'Strength', 'Flexibility', 'Sport'];
  const muscles = ['Ngực', 'Lưng', 'Chân', 'Vai', 'Tay', 'Bụng'];

  const toggleMuscle = (m) => {
    setSelectedMuscles(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const handleResetFilters = () => {
    setSelectedMuscles([]);
    setRatingFilter({ min: '', max: '' });
    setIsCustom(false);
    setIsFavorite(false);
  };

  const mockExercises = [
    { name: "Chạy bộ ngoài trời", rating: 5, time: "30 phút", kcal: 300, img: "🏃‍♂️", type: 'Cardio' },
    { name: "Đạp xe địa hình", rating: 4.5, time: "45 phút", kcal: 450, img: "🚴‍♂️", type: 'Cardio' },
    { name: "Nâng tạ đòn", rating: 4.8, time: "15 phút", kcal: 200, img: "🏋️", type: 'Strength' },
    { name: "Hít đất", rating: 4.2, time: "10 phút", kcal: 150, img: "💪", type: 'Strength' },
  ];

  const handleSelectExercise = (ex) => {
    setSelectedExercise(ex);
    setView('detail');
  };

  const handleSaveToSchedule = () => {
    setScheduledExercises([...scheduledExercises, {
      ...selectedExercise,
      mode: exerciseMode,
      sets,
      repsOrTime,
      restTime
    }]);
    setView('schedule');
  };

  // 1. SCHEDULE VIEW
  if (view === 'schedule') {
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
                  <span className={`text-base mb-2 ${item.date === 20 ? 'font-medium' : 'font-normal'}`}>{item.day}</span>
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold ${
                    item.date === 20 ? 'bg-white text-black' : 'bg-white text-black'
                  }`}>
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
  }

  // 1.5. SCHEDULED LIST VIEW
  if (view === 'list') {
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
                  <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl">
                    {item.img}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg text-white mb-1">{item.name}</h3>
                    <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                      <span>{item.sets} Sets</span>
                      <span>•</span>
                      <span>{item.repsOrTime} {item.mode === 'reps' ? 'Reps' : 'Giây'}</span>
                      <span>•</span>
                      <span className="text-[#c8f31d]">{item.kcal} kcal</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto">
            <button 
              onClick={() => {
                if(scheduledExercises.length > 0) {
                  setCurrentExerciseIndex(0);
                  setView('session');
                }
              }}
              disabled={scheduledExercises.length === 0}
              className={`w-full font-black py-5 rounded-[20px] text-xl transition-transform tracking-wide ${
                scheduledExercises.length > 0 ? 'bg-[#c8f31d] text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(200,243,29,0.15)]' : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              Bắt đầu tập luyện
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 1.8. SESSION VIEW
  if (view === 'session') {
    const currentEx = scheduledExercises[currentExerciseIndex] || scheduledExercises[0];
    const nextEx = scheduledExercises[currentExerciseIndex + 1];

    if (!currentEx) return null;

    return (
      <div className="h-full bg-[#111] text-white relative font-sans overflow-hidden flex flex-col">
        {/* Top Image Half */}
        <div className="h-1/2 relative rounded-b-[40px] overflow-hidden shrink-0 shadow-2xl">
          <img src={`https://picsum.photos/seed/${currentEx.name}/800/800`} alt={currentEx.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/20 to-black/60"></div>
          
          <button onClick={() => setView('list')} className="absolute top-8 left-6 text-[#c8f31d] hover:text-white transition-colors">
            <ChevronLeft size={36} strokeWidth={3} />
          </button>
        </div>

        {/* Info & Timer */}
        <div className="flex-1 px-8 pt-6 flex flex-col">
          <div className="mb-4 text-left">
            <p className="text-[#c8f31d] font-bold text-xs mb-2 tracking-widest uppercase">Exercise {currentExerciseIndex + 1}/{scheduledExercises.length}</p>
            <h2 className="text-3xl font-medium tracking-wide leading-tight">{currentEx.name}</h2>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-4">
            {/* Circular Timer Mock */}
            <div className="relative w-40 h-40 rounded-full border-8 border-zinc-800 flex flex-col items-center justify-center mb-4 shadow-inner">
              <div className="absolute inset-[-8px] rounded-full border-8 border-[#c8f31d] border-t-transparent border-r-transparent -rotate-45"></div>
              <span className="text-3xl font-bold tracking-wider">
                00:{currentEx.repsOrTime < 10 ? `0${currentEx.repsOrTime}` : currentEx.repsOrTime}
              </span>
            </div>
            <p className="text-white font-bold text-xl tracking-wider">10:59</p>
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
                if(nextEx) setCurrentExerciseIndex(prev => prev + 1);
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
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-zinc-700">
                    <img src={`https://picsum.photos/seed/${nextEx.name}/200/200`} alt={nextEx.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-white">{nextEx.name}</h4>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400">
                      <span className="text-[#c8f31d] flex items-center gap-1">🔥 {nextEx.kcal} kcal</span>
                      <span>|</span>
                      <span className="flex items-center gap-1">⏱ {nextEx.time}</span>
                    </div>
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
  }

  // 2. DETAIL FORM VIEW
  if (view === 'detail') {
    return (
      <div className="h-full bg-[#111] text-white relative font-sans overflow-hidden flex flex-col">
        <div className="px-8 pt-8 pb-4 flex items-center gap-4">
          <button onClick={() => setView('search')} className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white hover:bg-zinc-700 transition-colors shadow-inner">
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
                className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${exerciseMode === 'reps' ? 'bg-[#c8f31d] text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                Số Reps
              </button>
              <button 
                onClick={() => setExerciseMode('time')}
                className={`flex-1 py-3.5 rounded-xl font-bold transition-all ${exerciseMode === 'time' ? 'bg-[#c8f31d] text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}
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
                    value={sets} onChange={e => setSets(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4.5 px-5 text-white text-xl font-black focus:outline-none focus:border-[#c8f31d] shadow-inner"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold uppercase tracking-wider">Sets</span>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 font-bold uppercase tracking-wider text-sm mb-3 block">
                  {exerciseMode === 'reps' ? 'Số Reps mỗi Set' : 'Thời gian mỗi Set'}
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={repsOrTime} onChange={e => setRepsOrTime(e.target.value)}
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
                    value={restTime} onChange={e => setRestTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4.5 px-5 text-white text-xl font-black focus:outline-none focus:border-[#c8f31d] shadow-inner"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold uppercase tracking-wider">Giây</span>
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
  }

  // 3. SEARCH VIEW (Default from before)
  return (
    <div className="h-full bg-[#111] text-white relative font-sans overflow-hidden flex flex-col">
      <div className="px-8 pt-8 pb-4 flex items-center gap-4">
        <button onClick={() => setView('schedule')} className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white hover:bg-zinc-700 transition-colors shadow-inner">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-black">Tìm bài tập</h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        {/* Tabs */}
        <div className="px-8 mb-6">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={activeTab === tab ? { color: 'black', backgroundColor: 'rgb(200 243 29 / 82%)' } : {}}
                className={`px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all ${activeTab === tab
                    ? 'shadow-[0_0_15px_rgba(200,243,29,0.3)]'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="px-8 mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={22} />
            <input
              type="text"
              placeholder="Tìm kiếm bài tập..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4.5 pl-14 pr-4 text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] transition-all shadow-inner"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`w-[60px] border rounded-2xl flex items-center justify-center transition-colors shrink-0 shadow-inner ${showFilters ? 'bg-[#c8f31d] border-[#c8f31d] text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-[#c8f31d] hover:border-[#c8f31d]'}`}
          >
            <Filter size={24} />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="px-8 mb-8 space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
            {/* Nhóm cơ */}
            <div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Nhóm cơ</h3>
              <div className="grid grid-cols-3 gap-3">
                {muscles.map(m => (
                  <label key={m} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 cursor-pointer hover:bg-zinc-800 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={selectedMuscles.includes(m)}
                      onChange={() => toggleMuscle(m)}
                      className="w-5 h-5 rounded bg-zinc-800 border-zinc-600 text-[#c8f31d] focus:ring-[#c8f31d] focus:ring-offset-zinc-900 accent-[#c8f31d]" 
                    />
                    <span className="text-sm font-bold text-zinc-200">{m}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-6">
              {/* Rating */}
              <div className="flex-1">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Đánh giá (Sao)</h3>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    min="1" max="5" 
                    placeholder="Min"
                    value={ratingFilter.min}
                    onChange={(e) => setRatingFilter({...ratingFilter, min: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-3 text-white text-center focus:outline-none focus:border-[#c8f31d] transition-colors"
                  />
                  <span className="text-zinc-500 font-bold">-</span>
                  <input 
                    type="number" 
                    min="1" max="5" 
                    placeholder="Max"
                    value={ratingFilter.max}
                    onChange={(e) => setRatingFilter({...ratingFilter, max: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-3 text-white text-center focus:outline-none focus:border-[#c8f31d] transition-colors"
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div className="flex-1">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Trạng thái</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 cursor-pointer hover:bg-zinc-800 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isCustom}
                      onChange={(e) => setIsCustom(e.target.checked)}
                      className="w-5 h-5 rounded bg-zinc-800 border-zinc-600 text-[#c8f31d] focus:ring-[#c8f31d] focus:ring-offset-zinc-900 accent-[#c8f31d]" 
                    />
                    <span className="text-sm font-bold text-zinc-200">Tự tạo</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 cursor-pointer hover:bg-zinc-800 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={isFavorite}
                      onChange={(e) => setIsFavorite(e.target.checked)}
                      className="w-5 h-5 rounded bg-zinc-800 border-zinc-600 text-[#c8f31d] focus:ring-[#c8f31d] focus:ring-offset-zinc-900 accent-[#c8f31d]" 
                    />
                    <span className="text-sm font-bold text-zinc-200">Yêu thích</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4 border-t border-zinc-800">
              <button 
                onClick={handleResetFilters}
                className="flex-1 py-3.5 rounded-xl font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                Xóa bộ lọc
              </button>
              <button 
                onClick={() => setShowFilters(false)}
                className="flex-1 py-3.5 rounded-xl font-bold text-black bg-[#c8f31d] shadow-[0_0_15px_rgba(200,243,29,0.2)] hover:scale-[1.02] transition-transform"
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}

        {/* Exercise List */}
        <div className="px-8 space-y-4">
          {mockExercises.map((ex, i) => (
            <div 
              key={i} 
              onClick={() => handleSelectExercise(ex)}
              className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-4 flex gap-5 items-center group hover:bg-zinc-800/80 hover:border-zinc-700 transition-all shadow-lg cursor-pointer"
            >
              <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-700 overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-3xl">
                  {ex.img}
                </div>
              </div>
              
              <div className="flex-1 py-1">
                <h3 className="text-lg font-black text-white mb-1.5 group-hover:text-[#c8f31d] transition-colors">{ex.name}</h3>
                
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-2.5">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={14}
                      fill={star <= Math.floor(ex.rating) ? "#eab308" : "none"}
                      color={star <= Math.floor(ex.rating) ? "#eab308" : "#52525b"}
                    />
                  ))}
                  <span className="text-xs text-zinc-400 font-bold ml-1.5">{ex.rating}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-extrabold text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg uppercase tracking-wider">{ex.time}</span>
                  <span className="text-sm font-black text-[#c8f31d]">{ex.kcal} kcal</span>
                </div>
              </div>
              
              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:bg-[#c8f31d] group-hover:text-black text-zinc-400 transition-colors shrink-0 shadow-md">
                <Plus size={24} strokeWidth={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workouts;
