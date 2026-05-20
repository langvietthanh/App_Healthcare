/**
 * Tác dụng của file: Hiển thị từng thẻ bữa ăn (Bữa sáng, trưa, tối, phụ) kèm danh sách món ăn đã ăn và nút để mở form thêm món.
 * File này dùng cho component cha nào là chính: MealPlan (src/pages/user/mealplan/index.jsx)
 */
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const MealHeader = ({ title, targetKcal, currentKcal, Icon }) => (
  <div className="flex justify-between items-start mb-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-[#c8f31d] shadow-inner">
        <Icon size={24} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-zinc-500 text-sm font-medium">Khuyến nghị: {targetKcal} kcal</p>
      </div>
    </div>
    <div className="text-right">
      <span className="text-2xl font-black text-white">{currentKcal}</span>
      <span className="text-sm text-zinc-500 ml-1">kcal</span>
    </div>
  </div>
);

const FoodItem = ({ item, onRemoveItem, Trash2 }) => (
  <div className="flex justify-between items-center px-4 py-3 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
    <div className="flex flex-col">
      <span className="font-semibold text-white">{item.name}</span>
      <span className="text-xs text-zinc-400">{item.amount}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="font-bold text-[#c8f31d]">{item.kcal} kcal</span>
      {onRemoveItem && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemoveItem(item.id); }}
          className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  </div>
);

const AddFoodButton = ({ id, title, onAddFood, Plus }) => (
  <button
    onClick={() => onAddFood(id, title)}
    className="w-full mt-2 bg-transparent border-2 border-zinc-700 text-white font-bold py-3.5 rounded-xl hover:border-[#c8f31d] hover:text-[#c8f31d] transition-all flex items-center justify-center gap-2"
  >
    <Plus size={20} strokeWidth={3} />
    Nhập món ăn
  </button>
);

const MealCard = ({ id, title, icon: Icon, currentKcal, targetKcal, items = [], onAddFood, onRemoveItem }) => {
  return (
    <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-[24px] p-6 mb-6 shadow-xl transition-all hover:bg-zinc-900/80 group">
      <MealHeader 
        title={title} 
        targetKcal={targetKcal} 
        currentKcal={currentKcal} 
        Icon={Icon} 
      />

      {items.length > 0 ? (
        <div className="space-y-3 mt-6 mb-6">
          {items.map((item, index) => (
            <FoodItem 
              key={index} 
              item={item} 
              onRemoveItem={onRemoveItem} 
              Trash2={Trash2} 
            />
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-zinc-600 text-sm font-medium">
          Chưa có món ăn nào được thêm
        </div>
      )}

      <AddFoodButton 
        id={id} 
        title={title} 
        onAddFood={onAddFood} 
        Plus={Plus} 
      />
    </div>
  );
};

export default MealCard;
