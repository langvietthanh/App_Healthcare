/**
 * Tác dụng của file: Hiển thị thanh tìm kiếm người dùng và nút bộ lọc nâng cao.
 * File này dùng cho component cha nào là chính: AdminUsers (src/pages/admin/users/index.jsx)
 */
import React from 'react';
import { Search, Filter } from 'lucide-react';
import AdvancedFilterPanel from './AdvancedFilterPanel';

const UserSearch = ({ search, setSearch, filters, setFilters, defaultFilters, isFilterOpen, setIsFilterOpen }) => {
  return (
    <div className="flex gap-3 relative">
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
        className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-colors text-sm font-medium ${
          isFilterOpen 
            ? 'bg-zinc-800 border-zinc-700 text-white' 
            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
        }`}
      >
        <Filter size={16} /> Lọc nâng cao
      </button>

      {isFilterOpen && (
        <AdvancedFilterPanel 
          filters={filters} 
          setFilters={setFilters} 
          defaultFilters={defaultFilters} 
          onClose={() => setIsFilterOpen(false)} 
        />
      )}
    </div>
  );
};

export default UserSearch;
