import { Search, SlidersHorizontal } from 'lucide-react';
import AdvancedFilterPanel from './AdvancedFilterPanel';

const UserSearch = ({ search, setSearch, filters, setFilters, defaultFilters, isFilterOpen, setIsFilterOpen, tab, setTab, lockedCount }) => {
  const activeFilters = Object.keys(filters).filter(k => filters[k] !== defaultFilters[k] && filters[k] !== '').length;

  return (
    <div className="space-y-4">
      {/* Tab */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('all')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
            }`}
        >
          Tất cả người dùng
        </button>
        <button
          onClick={() => setTab('locked')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${tab === 'locked' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
            }`}
        >
          Bị khóa
          {lockedCount > 0 && (
            <span className="w-5 h-5 bg-zinc-600 text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {lockedCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#c8f31d] transition-colors text-sm"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(prev => !prev)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${isFilterOpen || activeFilters > 0
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

      {isFilterOpen && (
        <AdvancedFilterPanel
          filters={filters}
          setFilters={setFilters}
          defaultFilters={defaultFilters}
        />
      )}
    </div>
  );
};

export default UserSearch;
