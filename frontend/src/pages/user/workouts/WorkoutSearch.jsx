import React from 'react';
import { ArrowLeft, Search, Filter, Star, Plus } from 'lucide-react';

const SearchHeader = ({ setView }) => (
  <div className="px-8 pt-8 pb-4 flex items-center gap-4">
    <button
      onClick={() => setView('schedule')}
      className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-white hover:bg-zinc-700 transition-colors shadow-inner"
    >
      <ArrowLeft size={24} />
    </button>
    <h2 className="text-2xl font-black">Tìm bài tập</h2>
  </div>
);

const SearchTabs = ({ tabs, activeTab, setActiveTab }) => (
  <div className="px-8 mb-6">
    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          style={activeTab === tab ? { color: 'black', backgroundColor: 'rgb(200 243 29 / 82%)' } : {}}
          className={`px-6 py-3.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
            activeTab === tab
              ? 'shadow-[0_0_15px_rgba(200,243,29,0.3)]'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  </div>
);

const SearchBar = ({ search, setSearch, showFilters, setShowFilters }) => (
  <div className="px-8 mb-6 flex gap-3">
    <div className="relative flex-1">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" size={22} />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm bài tập..."
        className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4.5 pl-14 pr-4 text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] transition-all shadow-inner"
      />
    </div>
    <button
      onClick={() => setShowFilters(!showFilters)}
      className={`w-[60px] border rounded-2xl flex items-center justify-center transition-colors shrink-0 shadow-inner ${
        showFilters
          ? 'bg-[#c8f31d] border-[#c8f31d] text-black'
          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-[#c8f31d] hover:border-[#c8f31d]'
      }`}
    >
      <Filter size={24} />
    </button>
  </div>
);

const FilterPanel = ({
  muscles, selectedMuscles, toggleMuscle,
  ratingFilter, setRatingFilter,
  isCustom, setIsCustom,
  isFavorite, setIsFavorite,
  handleResetFilters, setShowFilters
}) => (
  <div className="px-8 mb-8 space-y-6 animate-in slide-in-from-top-2 fade-in duration-200">
    <div>
      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Nhóm cơ</h3>
      <div className="grid grid-cols-3 gap-3">
        {muscles.map((m) => (
          <label
            key={m}
            className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 cursor-pointer hover:bg-zinc-800 transition-colors"
          >
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
      <div className="flex-1">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Đánh giá (Sao)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Min"
            value={ratingFilter.min}
            onChange={(e) => setRatingFilter({ ...ratingFilter, min: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-3 text-white text-center focus:outline-none focus:border-[#c8f31d] transition-colors"
          />
          <span className="text-zinc-500 font-bold">-</span>
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Max"
            value={ratingFilter.max}
            onChange={(e) => setRatingFilter({ ...ratingFilter, max: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-3 text-white text-center focus:outline-none focus:border-[#c8f31d] transition-colors"
          />
        </div>
      </div>

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
);

const ExerciseList = ({ listExercises, handleSelectExercise }) => (
  <div className="px-8 space-y-4">
    {listExercises.map((ex, i) => (
      <div
        key={i}
        onClick={() => handleSelectExercise(ex)}
        className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-3xl p-4 flex gap-5 items-center group hover:bg-zinc-800/80 hover:border-zinc-700 transition-all shadow-lg cursor-pointer"
      >
        <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center shrink-0 border border-zinc-700 overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-3xl">
            {ex.img && (ex.img.startsWith('http') || ex.img.startsWith('/') || ex.img.includes('.')) ? (
              <img src={ex.img} alt={ex.name} className="w-full h-full object-cover" />
            ) : (
              <span>{ex.img || '🏋️'}</span>
            )}
          </div>
        </div>

        <div className="flex-1 py-1">
          <h3 className="text-lg font-black text-white mb-1.5 group-hover:text-[#c8f31d] transition-colors font-sans">
            {ex.name}
          </h3>

          <div className="flex items-center gap-1 mb-2.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                fill={star <= Math.floor(ex.rating) ? '#eab308' : 'none'}
                color={star <= Math.floor(ex.rating) ? '#eab308' : '#52525b'}
              />
            ))}
            <span className="text-xs text-zinc-400 font-bold ml-1.5">{ex.rating}</span>
          </div>

          {ex.muscles && ex.muscles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {ex.muscles.map((m, i) => (
                <span key={i} className="text-[10px] font-extrabold text-[#c8f31d] bg-[#c8f31d]/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:bg-[#c8f31d] group-hover:text-black text-zinc-400 transition-colors shrink-0 shadow-md">
          <Plus size={24} strokeWidth={3} />
        </div>
      </div>
    ))}
  </div>
);

const WorkoutSearch = ({
  setView,
  tabs,
  activeTab,
  setActiveTab,
  showFilters,
  setShowFilters,
  muscles,
  selectedMuscles,
  toggleMuscle,
  ratingFilter,
  setRatingFilter,
  isCustom,
  setIsCustom,
  isFavorite,
  setIsFavorite,
  handleResetFilters,
  listExercises,
  handleSelectExercise,
  search,
  setSearch,
}) => {
  return (
    <div className="h-full bg-[#111] text-white relative font-sans overflow-hidden flex flex-col">
      <SearchHeader setView={setView} />
      
      <div className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <SearchTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <SearchBar 
          search={search} 
          setSearch={setSearch} 
          showFilters={showFilters} 
          setShowFilters={setShowFilters} 
        />

        {showFilters && (
          <FilterPanel
            muscles={muscles}
            selectedMuscles={selectedMuscles}
            toggleMuscle={toggleMuscle}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            isCustom={isCustom}
            setIsCustom={setIsCustom}
            isFavorite={isFavorite}
            setIsFavorite={setIsFavorite}
            handleResetFilters={handleResetFilters}
            setShowFilters={setShowFilters}
          />
        )}

        <ExerciseList 
          listExercises={listExercises} 
          handleSelectExercise={handleSelectExercise} 
        />
      </div>
    </div>
  );
};

export default WorkoutSearch;
