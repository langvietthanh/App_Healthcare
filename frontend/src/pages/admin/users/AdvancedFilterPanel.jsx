import React from 'react';

const AdvancedFilterPanel = ({ filters, setFilters, defaultFilters, onClose }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="absolute top-full right-0 mt-3 w-80 md:w-[450px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
        <h3 className="text-white font-bold text-lg">Bộ lọc nâng cao</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
        
        {/* 1. Nhóm Nhân khẩu học */}
        <div className="space-y-3">
          <h4 className="text-[#c8f31d] font-semibold text-sm uppercase tracking-wider">1. Nhân khẩu học</h4>
          
          <div className="space-y-2">
            <label className="text-zinc-400 text-xs font-medium">Giới tính</label>
            <select name="gender" value={filters.gender} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d]">
              <option value="all">Tất cả</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-zinc-400 text-xs font-medium">Khoảng độ tuổi</label>
            <div className="flex items-center gap-2">
              <input type="number" name="ageMin" value={filters.ageMin} onChange={handleChange} placeholder="Từ..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d]" />
              <span className="text-zinc-500">-</span>
              <input type="number" name="ageMax" value={filters.ageMax} onChange={handleChange} placeholder="Đến..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d]" />
            </div>
          </div>
        </div>

        {/* 2. Nhóm Vận động */}
        <div className="space-y-3">
          <h4 className="text-[#c8f31d] font-semibold text-sm uppercase tracking-wider">2. Vận động & Năng lượng</h4>
          
          <div className="space-y-2">
            <label className="text-zinc-400 text-xs font-medium">Mức độ hoạt động</label>
            <select name="activityLevel" value={filters.activityLevel} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d]">
              <option value="all">Tất cả</option>
              <option value="sedentary">Ít vận động (Sedentary)</option>
              <option value="light">Vận động nhẹ (Light)</option>
              <option value="moderate">Vận động vừa phải (Moderate)</option>
              <option value="active">Năng động (Active)</option>
              <option value="very_active">Cực kỳ năng động (Very Active)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-zinc-400 text-xs font-medium">Khoảng TDEE (kcal)</label>
            <div className="flex items-center gap-2">
              <input type="number" name="tdeeMin" value={filters.tdeeMin} onChange={handleChange} placeholder="Từ..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d]" />
              <span className="text-zinc-500">-</span>
              <input type="number" name="tdeeMax" value={filters.tdeeMax} onChange={handleChange} placeholder="Đến..." className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d]" />
            </div>
          </div>
        </div>

        {/* 3. Nhóm Hệ thống */}
        <div className="space-y-3">
          <h4 className="text-[#c8f31d] font-semibold text-sm uppercase tracking-wider">3. Tài khoản & Hệ thống</h4>
          
          <div className="space-y-2">
            <label className="text-zinc-400 text-xs font-medium">Vai trò</label>
            <select name="role" value={filters.role} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d]">
              <option value="all">Tất cả</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-zinc-400 text-xs font-medium">Ngày tham gia</label>
            <div className="flex items-center gap-2">
              <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d] [color-scheme:dark]" />
              <span className="text-zinc-500">-</span>
              <input type="date" name="dateTo" value={filters.dateTo} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d] [color-scheme:dark]" />
            </div>
          </div>
        </div>
        
      </div>

      <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
        <button 
          onClick={() => setFilters(defaultFilters)}
          className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          Đặt lại
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;
