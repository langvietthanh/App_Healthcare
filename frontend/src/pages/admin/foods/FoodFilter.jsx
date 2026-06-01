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
  macroFilter,
  setMacroFilter,
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
        <select
          value={macroFilter}
          onChange={(e) => setMacroFilter(e.target.value)}
          className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none cursor-pointer ${
            macroFilter !== 'all'
              ? 'border-[#c8f31d] text-[#c8f31d] bg-zinc-900'
              : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
          }`}
        >
          <option value="all">Tất cả món</option>
          <option value="high_protein">Giàu Protein (&gt; 20g)</option>
          <option value="low_fat">Ít Chất béo (&lt; 3g)</option>
          <option value="low_carbs">Ít Tinh bột (&lt; 10g)</option>
        </select>
      </div>
    </div>
  );
};

export default FoodFilter;
