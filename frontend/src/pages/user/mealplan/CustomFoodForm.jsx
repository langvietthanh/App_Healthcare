/**
 * Tác dụng của file: Giao diện form tạo món cá nhân mới thực tế gửi API lên Backend (lưu trữ dưới dạng món riêng tư của chính user đó).
 * File này dùng cho component cha nào là chính: MealPlan (src/pages/user/mealplan/index.jsx)
 */
import React, { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import axiosClient from '../../../config/axiosClient';

const CustomFoodForm = ({ onSave }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('100');
  const [unit, setUnit] = useState('g');
  const [calories, setCalories] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên món ăn');
      return;
    }

    setLoading(true);
    const payload = {
      name,
      amount: +amount || 100,
      unit,
      protein: +protein || 0,
      carbs: +carbs || 0,
      fat: +fat || 0,
      isPublic: false // Món cá nhân
    };

    try {
      await axiosClient.post('/foods', payload);
      onSave(); // Reload và đóng form
    } catch (err) {
      console.error('Error creating custom food:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi tạo món ăn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#111] scrollbar-hide">
      {/* Ảnh món ăn */}
      <div className="flex justify-center mb-8 mt-2">
        <div className="w-24 h-24 bg-zinc-800 rounded-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-600 cursor-pointer hover:border-[#c8f31d] hover:text-[#c8f31d] transition-colors relative group">
          <Plus size={28} className="text-zinc-500 group-hover:text-[#c8f31d] mb-1" strokeWidth={3} />
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider group-hover:text-[#c8f31d]">Thêm ảnh</span>
        </div>
      </div>

      {/* Tên món ăn */}
      <div className="mb-6">
        <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Tên món ăn <span className="text-rose-500">*</span></label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ví dụ: Sinh tố bơ chuối..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-bold focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none transition-all shadow-inner"
        />
      </div>

      {/* Định lượng 1 phần ăn */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Định lượng 1 phần <span className="text-rose-500">*</span></label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-bold focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none transition-all shadow-inner"
          />
        </div>
        <div className="w-1/3">
          <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Đơn vị</label>
          <div className="relative">
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white font-bold focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none appearance-none transition-all shadow-inner cursor-pointer"
            >
              <option value="g">g</option>
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

      {/* Calo */}
      <div className="mb-8">
        <label className="text-xs font-bold text-zinc-400 mb-2 block uppercase tracking-widest">Năng lượng (Tự tính từ macros) <span className="text-rose-500">*</span></label>
        <div className="relative">
          <input
            type="number"
            value={calories || ((+protein || 0) * 4 + (+carbs || 0) * 4 + (+fat || 0) * 9) || ''}
            onChange={(e) => setCalories(e.target.value)}
            disabled
            placeholder="0"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 pl-6 text-white font-black text-2xl focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d] focus:outline-none text-[#c8f31d] transition-all shadow-inner opacity-75"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">kcal</span>
        </div>
      </div>

      {/* Macros */}
      <div className="mb-10">
        <label className="text-xs font-bold text-zinc-400 mb-3 block uppercase tracking-widest">Thông tin dinh dưỡng (Tuỳ chọn)</label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] text-amber-400 font-bold mb-1 block text-center uppercase tracking-wider">Carbs</label>
            <div className="relative">
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-bold text-center focus:border-amber-400 focus:outline-none shadow-inner"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-bold">g</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-rose-400 font-bold mb-1 block text-center uppercase tracking-wider">Protein</label>
            <div className="relative">
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-bold text-center focus:border-rose-400 focus:outline-none shadow-inner"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-bold">g</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-green-400 font-bold mb-1 block text-center uppercase tracking-wider">Fat</label>
            <div className="relative">
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-bold text-center focus:border-green-400 focus:outline-none shadow-inner"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-bold">g</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-[#c8f31d] text-black font-black py-4 rounded-2xl text-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(200,243,29,0.2)] mb-4 disabled:opacity-50"
      >
        {loading ? 'Đang lưu...' : 'Lưu món ăn'}
      </button>
    </div>
  );
};

export default CustomFoodForm;
