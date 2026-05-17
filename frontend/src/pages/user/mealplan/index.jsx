/**
 * Tác dụng của file: Điều phối chính và quản lý State (activeMeal, selectedFood, activeTab, lượng ăn) cho tính năng thực đơn hàng ngày của người dùng.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/user/index.js)
 */
import React, { useState } from 'react';
import { Coffee, Sun, Moon, Cookie, ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import MealCard from './MealCard';
import CustomFoodForm from './CustomFoodForm';
import FoodSearchList from './FoodSearchList';
import PortionDetailForm from './PortionDetailForm';

const MealPlan = () => {
  const [activeMeal, setActiveMeal] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [amount, setAmount] = useState('100');
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');
  const [isCreatingFood, setIsCreatingFood] = useState(false);

  const handleAddFood = (id, title) => {
    setActiveMeal({ id, title });
    setSelectedFood(null);
    setIsCreatingFood(false);
  };

  const handleCloseSearch = () => {
    if (isCreatingFood) {
      setIsCreatingFood(false);
    } else if (selectedFood) {
      setSelectedFood(null);
    } else {
      setActiveMeal(null);
    }
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setAmount('100');
    setIsFavorite(false);
  };

  return (
    <div className="h-full bg-[#111] text-white relative font-sans overflow-hidden flex flex-col">
      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto pt-10 pb-20 scrollbar-hide">
        {/* Header */}
        <div className="px-8 mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">
              Thực đơn <span className="text-[#c8f31d]">Hôm nay</span>
            </h1>
            <p className="text-zinc-400 font-medium">Ghi chép các bữa ăn để theo dõi lượng calo</p>
          </div>
          <div className="w-16 h-16 rounded-[20px] bg-zinc-800 flex flex-col items-center justify-center border border-zinc-700 shadow-lg">
            <span className="text-xs font-bold text-zinc-400 uppercase">Tháng 5</span>
            <span className="text-xl font-black text-[#c8f31d]">14</span>
          </div>
        </div>

        {/* Summary Banner */}
        <div className="px-8 mb-8">
          <div className="bg-gradient-to-r from-[#c8f31d]/20 to-transparent border border-[#c8f31d]/30 rounded-2xl p-6 flex justify-between items-center">
            <div>
              <p className="text-zinc-300 text-sm font-medium mb-1">Tổng lượng Calo đã nạp</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#c8f31d]">593</span>
                <span className="text-zinc-500 font-bold">/ 2000 kcal</span>
              </div>
            </div>
            <button className="w-10 h-10 bg-[#c8f31d] text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              <ChevronRight size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Meals List */}
        <div className="px-8">
          <MealCard
            id="breakfast"
            title="Bữa sáng"
            icon={Coffee}
            currentKcal={320}
            targetKcal={500}
            items={[{ name: 'Phở bò', amount: '1 bát vừa', kcal: 320 }]}
            onAddFood={handleAddFood}
          />

          <MealCard
            id="lunch"
            title="Bữa trưa"
            icon={Sun}
            currentKcal={273}
            targetKcal={700}
            items={[{ name: 'Cơm tấm', amount: '1 đĩa', kcal: 273 }]}
            onAddFood={handleAddFood}
          />

          <MealCard
            id="dinner"
            title="Bữa tối"
            icon={Moon}
            currentKcal={0}
            targetKcal={600}
            items={[]}
            onAddFood={handleAddFood}
          />

          <MealCard
            id="snack"
            title="Bữa phụ"
            icon={Cookie}
            currentKcal={0}
            targetKcal={200}
            items={[]}
            onAddFood={handleAddFood}
          />
        </div>
      </div>

      {/* Tầng Overlay Thêm Món Ăn (Search Food / Portion Form) */}
      {activeMeal && (
        <div className="absolute inset-0 bg-[#111] z-50 flex flex-col h-full animate-[slideIn_0.3s_ease-out]">
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>

          {/* Header Overlay */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-[#1a1a1a]">
            <button onClick={handleCloseSearch} className="text-zinc-400 hover:text-white transition-colors bg-zinc-800 p-2 rounded-full">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-white">
              {isCreatingFood ? 'Tạo món cá nhân' : selectedFood ? 'Chi tiết món ăn' : `Thêm món - ${activeMeal.title}`}
            </h2>
            {selectedFood && !isCreatingFood ? (
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-rose-500/20 text-rose-500' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
              >
                <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            ) : (
              <div className="w-10"></div>
            )}
          </div>

          {isCreatingFood ? (
            /* Form Tạo Món Cá Nhân */
            <CustomFoodForm onSave={() => setIsCreatingFood(false)} />
          ) : !selectedFood ? (
            /* Danh sách tìm kiếm */
            <FoodSearchList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsCreatingFood={setIsCreatingFood}
              handleSelectFood={handleSelectFood}
            />
          ) : (
            /* Form nhập định lượng chi tiết */
            <PortionDetailForm
              selectedFood={selectedFood}
              amount={amount}
              setAmount={setAmount}
              onSubmit={handleCloseSearch}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MealPlan;
