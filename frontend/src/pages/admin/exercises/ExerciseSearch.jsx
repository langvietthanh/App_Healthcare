/**
 * Tác dụng của file: Hiển thị thanh tìm kiếm bài tập và các dropdown lọc độ khó, nhóm cơ, danh mục.
 * File này dùng cho component cha nào là chính: AdminExercises (src/pages/admin/exercises/index.jsx)
 */
import { Search, SlidersHorizontal } from 'lucide-react';
import { CATEGORIES, MUSCLES } from '../../../constants';

const ExerciseSearch = ({
  search,
  setSearch,
  showFilter,
  setShowFilter,
  filterCategory,
  setFilterCategory,
  filterMuscle,
  setFilterMuscle,
  filterLevel,
  setFilterLevel,
  activeFilters,
}) => {
  return (
    <div className="space-y-4">
      {/* Search & Filter */}
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
          onClick={() => setShowFilter((v) => !v)}
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

      {/* Filter panel */}
      {showFilter && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 grid grid-cols-3 gap-4">
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
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Độ khó</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors"
            >
              <option value="">Tất cả</option>
              {['Dễ', 'Trung bình', 'Khó'].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-3 flex justify-end">
            <button
              onClick={() => {
                setFilterCategory('');
                setFilterMuscle('');
                setFilterLevel('');
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseSearch;
