/**
 * Tác dụng của file: Hiển thị thanh tìm kiếm thực phẩm, các tab phân loại (Gần đây, Yêu thích, Của tôi) và danh sách gợi ý món ăn để chọn.
 * File này dùng cho component cha nào là chính: MealPlan (src/pages/user/mealplan/index.jsx)
 */
import React from 'react';
import { Search, Plus } from 'lucide-react';

const FoodSearchList = ({
  activeTab,
  setActiveTab,
  setIsCreatingFood,
  handleSelectFood,
}) => {
  return (
    <>
      {/* Thanh tìm kiếm */}
      <div className="p-6 bg-[#1a1a1a]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input
            type="text"
            autoFocus
            placeholder="Tìm kiếm thực phẩm..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Tabs phân loại */}
      <div className="flex px-6 bg-[#1a1a1a] border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 pb-4 text-sm tracking-wide uppercase transition-colors font-bold ${activeTab === 'recent' ? 'text-[#c8f31d] border-b-2 border-[#c8f31d]' : 'text-zinc-500 hover:text-white'}`}
        >Gần đây</button>
        <button
          onClick={() => setActiveTab('favorite')}
          className={`flex-1 pb-4 text-sm tracking-wide uppercase transition-colors font-bold ${activeTab === 'favorite' ? 'text-[#c8f31d] border-b-2 border-[#c8f31d]' : 'text-zinc-500 hover:text-white'}`}
        >Yêu thích</button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 pb-4 text-sm tracking-wide uppercase transition-colors font-bold ${activeTab === 'custom' ? 'text-[#c8f31d] border-b-2 border-[#c8f31d]' : 'text-zinc-500 hover:text-white'}`}
        >Của tôi</button>
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

        {(activeTab === 'recent' || activeTab === 'favorite' || activeTab === 'custom') && [
          { name: "Cơm trắng", desc: "1 bát vừa (200g)", kcal: 260, carbs: 58, protein: 5, fat: 0 },
          { name: "Thịt lợn luộc", desc: "100g", kcal: 242, carbs: 0, protein: 27, fat: 14 },
          { name: "Rau muống xào", desc: "1 đĩa vừa", kcal: 110, carbs: 4, protein: 3, fat: 9 },
          { name: "Trứng ốp la", desc: "1 quả", kcal: 90, carbs: 1, protein: 6, fat: 7 },
          { name: "Bánh mì Pate", desc: "1 ổ", kcal: 350, carbs: 40, protein: 12, fat: 15 },
          { name: "Sữa chua không đường", desc: "1 hộp", kcal: 60, carbs: 5, protein: 4, fat: 3 },
          { name: "Chuối tây", desc: "1 quả", kcal: 88, carbs: 23, protein: 1, fat: 0 },
        ].map((food, i) => (
          <div
            key={i}
            onClick={() => handleSelectFood(food)}
            className="flex justify-between items-center p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700">
                <img src="/icon_protein.png" alt={food.name} className="w-full h-full object-cover opacity-80" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">{food.name}</h4>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-zinc-500 text-xs font-medium">{food.desc}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <span className="text-[#c8f31d] text-sm font-extrabold">{food.kcal} kcal</span>
                </div>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#c8f31d] group-hover:bg-[#c8f31d] group-hover:text-black transition-colors shadow-lg">
              <Plus size={20} strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default FoodSearchList;
