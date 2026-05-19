/**
 * Tác dụng của file: Hiển thị thanh tìm kiếm thực phẩm thật từ Database, các tab phân loại (Tất cả/Gần đây, Yêu thích, Món của tôi) và danh sách gợi ý món ăn để chọn.
 * File này dùng cho component cha nào là chính: MealPlan (src/pages/user/mealplan/index.jsx)
 */
import React from 'react';
import { Search, Plus } from 'lucide-react';

const FoodSearchList = ({
  activeTab,
  setActiveTab,
  setIsCreatingFood,
  handleSelectFood,
  search,
  setSearch,
  listFoods = [],
  loading = false,
}) => {
  return (
    <>
      {/* Thanh tìm kiếm */}
      <div className="p-6 bg-[#1a1a1a]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm thực phẩm..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Tabs phân loại */}
      <div className="flex px-6 bg-[#1a1a1a] border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 pb-4 text-sm tracking-wide uppercase transition-colors font-bold ${activeTab === 'all' ? 'text-[#c8f31d] border-b-2 border-[#c8f31d]' : 'text-zinc-500 hover:text-white'}`}
        >Tìm kiếm</button>
        <button
          onClick={() => setActiveTab('favorite')}
          className={`flex-1 pb-4 text-sm tracking-wide uppercase transition-colors font-bold ${activeTab === 'favorite' ? 'text-[#c8f31d] border-b-2 border-[#c8f31d]' : 'text-zinc-500 hover:text-white'}`}
        >Yêu thích</button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 pb-4 text-sm tracking-wide uppercase transition-colors font-bold ${activeTab === 'custom' ? 'text-[#c8f31d] border-b-2 border-[#c8f31d]' : 'text-zinc-500 hover:text-white'}`}
        >Món của tôi</button>
      </div>

      {/* Danh sách món ăn gợi ý */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#111] scrollbar-hide">
        {activeTab === 'custom' && (
          <button
            onClick={() => setIsCreatingFood(true)}
            className="w-full mb-4 bg-zinc-900 border-2 border-dashed border-zinc-700 text-zinc-400 font-bold py-5 rounded-2xl hover:border-[#c8f31d] hover:text-[#c8f31d] hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-inner"
          >
            <Plus size={22} strokeWidth={3} />
            Tạo món cá nhân mới
          </button>
        )}

        {loading ? (
          <div className="py-8 text-center text-zinc-500 font-medium">Đang tìm món ăn...</div>
        ) : listFoods.length === 0 ? (
          <div className="py-8 text-center text-zinc-600 font-medium">Không tìm thấy món ăn nào</div>
        ) : (
          listFoods.map((food, i) => (
            <div
              key={food.id || i}
              onClick={() => handleSelectFood(food)}
              className="flex justify-between items-center p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer group animate-fade-in"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 flex items-center justify-center shrink-0">
                  {food.image && (food.image.startsWith('http') || food.image.startsWith('/') || food.image.includes('.')) ? (
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🍲</span>
                  )}
                </div>
                <div>
                  <h4 className="text-white font-bold text-base group-hover:text-[#c8f31d] transition-colors">{food.name}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-zinc-500 text-xs font-medium">{food.desc}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span className="text-[#c8f31d] text-sm font-extrabold">{food.kcal} kcal</span>
                  </div>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#c8f31d] group-hover:bg-[#c8f31d] group-hover:text-black transition-colors shadow-lg shrink-0">
                <Plus size={20} strokeWidth={3} />
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default FoodSearchList;
