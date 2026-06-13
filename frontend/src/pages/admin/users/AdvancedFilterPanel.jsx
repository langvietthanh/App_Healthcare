const AdvancedFilterPanel = ({ filters, setFilters, defaultFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Giới tính</label>
        <select name="gender" value={filters.gender} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors">
          <option value="all">Tất cả</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Mức độ hoạt động</label>
        <select name="activityLevel" value={filters.activityLevel} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors">
          <option value="all">Tất cả</option>
          <option value="sedentary">Ít vận động (Sedentary)</option>
          <option value="light">Vận động nhẹ (Light)</option>
          <option value="moderate">Vừa phải (Moderate)</option>
          <option value="active">Năng động (Active)</option>
          <option value="very_active">Rất năng động (Very Active)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Độ tuổi</label>
        <div className="flex items-center gap-2">
          <input type="number" name="ageMin" value={filters.ageMin} onChange={handleChange} placeholder="Từ..." className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors" />
          <span className="text-zinc-500">-</span>
          <input type="number" name="ageMax" value={filters.ageMax} onChange={handleChange} placeholder="Đến..." className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Trạng thái BMI</label>
        <select name="bmiStatus" value={filters.bmiStatus} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors">
          <option value="all">Tất cả</option>
          <option value="underweight">Thiếu cân (&lt; 18.5)</option>
          <option value="normal">Bình thường (18.5 - 24.9)</option>
          <option value="overweight">Thừa cân (25 - 29.9)</option>
          <option value="obese">Béo phì (&ge; 30)</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Ngày tham gia</label>
        <div className="flex items-center gap-2">
          <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d] [color-scheme:dark]" />
          <span className="text-zinc-500">-</span>
          <input type="date" name="dateTo" value={filters.dateTo} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d] [color-scheme:dark]" />
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end items-end">
        <button
          onClick={() => setFilters(defaultFilters)}
          className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;
