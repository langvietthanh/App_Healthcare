import { Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, MUSCLES } from '../../../constants';
import { useAdminExercises } from '../../../providers/admin/exercises';

const SearchBar = ({ search, setSearch, toggleFilter, showFilter, activeFilters }) => (
  <div className="flex gap-3">
    <div className="relative flex-1">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm bài tập..."
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#c8f31d] transition-colors text-sm"
      />
    </div>
    <button
      onClick={toggleFilter}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${showFilter || activeFilters > 0
        ? 'border-[#c8f31d] text-[#c8f31d] bg-[#c8f31d]/10'
        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
        }`}
    >
      <SlidersHorizontal size={16} />
      Bộ lọc
      {activeFilters > 0 && (
        <span className="w-5 h-5 bg-[#c8f31d] text-black text-[10px] font-black rounded-full flex items-center justify-center">
          {activeFilters}
        </span>
      )}
    </button>
  </div>
);

const FilterPanel = ({ filterCategory, filterMuscle, setFilterCategory, setFilterMuscle }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 grid grid-cols-2 gap-4">
    <div>
      <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Danh mục</label>
      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors"
      >
        <option value="">Tất cả</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Nhóm cơ</label>
      <select
        value={filterMuscle}
        onChange={(e) => setFilterMuscle(e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors"
      >
        <option value="">Tất cả</option>
        {MUSCLES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
    <div className="col-span-2 flex justify-end">
      <button
        onClick={() => {
          setFilterCategory('');
          setFilterMuscle('');
        }}
        className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
      >
        Xóa bộ lọc
      </button>
    </div>
  </div>
);

const ExerciseSearch = () => {
  const {
    state: { tab, exercises, search, showFilter, filterCategory, filterMuscle },
    setTab,
    setSearch,
    toggleFilter,
    setFilterCategory,
    setFilterMuscle
  } = useAdminExercises();

  const activeFilters = [filterCategory, filterMuscle].filter(Boolean).length;
  const hiddenCount = exercises.filter(e => !e.isPublic).length;

  return (
    <div className="space-y-4">
      {/* Tab */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('all')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
            }`}
        >
          Tất cả bài tập
        </button>
        <button
          onClick={() => setTab('hidden')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${tab === 'hidden' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
            }`}
        >
          Đã ẩn
          {hiddenCount > 0 && (
            <span className="w-5 h-5 bg-zinc-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {hiddenCount}
            </span>
          )}
        </button>
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        toggleFilter={toggleFilter}
        showFilter={showFilter}
        activeFilters={activeFilters}
      />

      {showFilter && (
        <FilterPanel
          filterCategory={filterCategory}
          filterMuscle={filterMuscle}
          setFilterCategory={setFilterCategory}
          setFilterMuscle={setFilterMuscle}
        />
      )}
    </div>
  );
};

export default ExerciseSearch;
