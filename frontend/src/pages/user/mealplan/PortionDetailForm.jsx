/**
 * Tác dụng của file: Hiển thị thông số dinh dưỡng chi tiết của món ăn đã chọn và form nhập định lượng (gram, ml, phần...) để thêm vào thực đơn.
 * File này dùng cho component cha nào là chính: MealPlan (src/pages/user/mealplan/index.jsx)
 */
import React from 'react';
import { ChevronRight } from 'lucide-react';

const FoodHeader = ({ selectedFood }) => (
  <div className="flex flex-col items-center mb-6 pt-2">
    <div className="w-24 h-24 bg-zinc-800 rounded-[20px] overflow-hidden border border-zinc-700 mb-4 shadow-xl">
      {selectedFood.image && (selectedFood.image.startsWith('http') || selectedFood.image.startsWith('/') || selectedFood.image.includes('.')) ? (
        <img src={selectedFood.image} alt={selectedFood.name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-5xl mt-5 block text-center">🍲</span>
      )}
    </div>
    <h3 className="text-2xl font-black text-white text-center mb-1">{selectedFood.name}</h3>
    <p className="text-[#c8f31d] font-bold text-lg">{selectedFood.kcal} kcal <span className="text-zinc-500 text-xs font-medium">/ {selectedFood.amount || 100}{selectedFood.unit || 'g'}</span></p>
  </div>
);

const MacroBreakdown = ({ selectedFood }) => (
  <div className="flex justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6 shadow-lg">
    <div className="text-center flex-1 border-r border-zinc-800">
      <p className="text-amber-400 font-black text-xl mb-1">{selectedFood.carbs}g</p>
      <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Carbs</p>
    </div>
    <div className="text-center flex-1 border-r border-zinc-800">
      <p className="text-rose-400 font-black text-xl mb-1">{selectedFood.protein}g</p>
      <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Protein</p>
    </div>
    <div className="text-center flex-1">
      <p className="text-green-400 font-black text-xl mb-1">{selectedFood.fat}g</p>
      <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Fat</p>
    </div>
  </div>
);

const AmountInput = ({ amount, setAmount, unit, setUnit, ChevronRight }) => (
  <div className="mb-4">
    <label className="text-zinc-400 font-bold text-sm mb-4 block uppercase tracking-wide">Nhập định lượng</label>
    <div className="flex items-center gap-4">
      <div className="flex-1 relative">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl py-4 px-5 text-white text-2xl font-black focus:outline-none focus:border-[#c8f31d] text-center shadow-inner"
        />
      </div>
      <div className="w-32 relative">
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl py-4 px-4 text-white text-lg font-bold focus:outline-none focus:border-[#c8f31d] appearance-none cursor-pointer"
        >
          <option value="g">gram</option>
          <option value="ml">ml</option>
          <option value="lb">lb</option>
          <option value="oz">oz</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronRight size={16} className="text-zinc-500 rotate-90" />
        </div>
      </div>
    </div>
  </div>
);

const SubmitButton = ({ onSubmit }) => (
  <div className="mt-6 pb-6">
    <button
      onClick={onSubmit}
      className="w-full bg-[#c8f31d] text-black font-black py-4 rounded-2xl text-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.2)]"
    >
      Thêm vào bữa ăn
    </button>
  </div>
);

const PortionDetailForm = ({
  selectedFood,
  amount,
  setAmount,
  unit,
  setUnit,
  onSubmit,
}) => {
  return (
    <div className="flex-1 flex flex-col p-5 bg-[#111] overflow-y-auto">
      <FoodHeader selectedFood={selectedFood} />
      
      <MacroBreakdown selectedFood={selectedFood} />
      
      <AmountInput amount={amount} setAmount={setAmount} unit={unit} setUnit={setUnit} ChevronRight={ChevronRight} />
      
      <SubmitButton onSubmit={onSubmit} />
    </div>
  );
};

export default PortionDetailForm;
