/**
 * Tác dụng của file: Hiển thị bộ chọn Tabs (Tất cả món ăn / Chờ duyệt), thanh tìm kiếm và bộ lọc thời gian từ ngày - đến ngày.
 * File này dùng cho component cha nào là chính: AdminFoods (src/pages/admin/foods/index.jsx)
 */
import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

const FoodFilter = ({
  tab,
  setTab,
  search,
  setSearch,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  showFilter,
  setShowFilter,
  pendingCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Tab */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('all')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Tất cả món ăn
        </button>
        <button
          onClick={() => setTab('pending')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            tab === 'pending' ? 'bg-orange-500/20 text-orange-400' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Chờ duyệt
          {pendingCount > 0 && (
            <span className="w-5 h-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm món ăn..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#c8f31d] transition-colors text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilter((v) => !v)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
            showFilter || dateFrom || dateTo
              ? 'border-[#c8f31d] text-[#c8f31d] bg-[#c8f31d]/10'
              : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <ChevronDown size={16} className={`transition-transform ${showFilter ? 'rotate-180' : ''}`} />
          Lọc theo ngày
        </button>
      </div>

      {/* Date filter panel */}
      {showFilter && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Từ ngày</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Đến ngày</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors cursor-pointer"
            />
          </div>
          <button
            onClick={() => {
              setDateFrom('');
              setDateTo('');
            }}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
          >
            Xóa lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodFilter;
