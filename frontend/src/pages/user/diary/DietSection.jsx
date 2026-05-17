/**
 * Tác dụng của file: Giao diện điều chỉnh Tỷ lệ Dinh dưỡng mục tiêu (Cân bằng, Low Carb, High Protein hoặc Tùy chỉnh %), vẽ biểu đồ thanh ngang động và nút lưu chế độ ăn.
 * File này dùng cho component cha nào là chính: Diary (src/pages/user/diary/index.jsx)
 */
import React, { useState } from 'react';

const DIET_PRESETS = {
  'Cân Bằng': { carbs: 40, protein: 40, fat: 20 },
  'Low Carb': { carbs: 25, protein: 45, fat: 30 },
  'High Protein': { carbs: 30, protein: 50, fat: 20 },
  'Tùy Chỉnh': null,
};

const DietSection = () => {
  const [selected, setSelected] = useState('Cân Bằng');
  const [macros, setMacros] = useState({ carbs: 40, protein: 40, fat: 20 });
  const total = macros.carbs + macros.protein + macros.fat;
  const isValid = total === 100;
  const macroConfig = [
    { key: 'carbs', label: 'Carbs', color: '#22c55e' },
    { key: 'protein', label: 'Chất đạm', color: '#ef4444' },
    { key: 'fat', label: 'Chất béo', color: '#f97316' },
  ];
  const handlePreset = (name) => {
    setSelected(name);
    if (DIET_PRESETS[name]) setMacros(DIET_PRESETS[name]);
  };
  const handleChange = (key, val) => {
    setSelected('Tùy Chỉnh');
    setMacros((prev) => ({ ...prev, [key]: Math.max(0, Math.min(100, Number(val))) }));
  };
  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Chế độ ăn</h2>
        <span className="text-xs text-zinc-500">Tỷ lệ dinh dưỡng</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {macroConfig.map((m) => (
          <div key={m.key} className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold" style={{ color: m.color }}>
              {m.label}
            </span>
            <input
              type="number"
              min="0"
              max="100"
              value={macros[m.key]}
              onChange={(e) => handleChange(m.key, e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-2 text-white text-center text-xl font-black focus:outline-none focus:border-[#c8f31d] transition-colors"
              style={{ borderColor: selected === 'Tùy Chỉnh' ? m.color : undefined }}
            />
            <span className="text-[10px] text-zinc-500">%</span>
          </div>
        ))}
      </div>
      <div className="space-y-2 mb-5">
        {macroConfig.map((m) => (
          <div key={m.key} className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-500 w-16 shrink-0">{m.label}</span>
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${macros[m.key]}%`, backgroundColor: m.color }}
              />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 w-8 text-right">
              {macros[m.key]}%
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between py-3 border-t border-b border-zinc-800 mb-5">
        <div>
          <span className="font-bold text-white">% Tổng</span>
          <p className="text-[10px] text-zinc-500 mt-0.5">Các chất dinh dưỡng phải tổng bằng 100%</p>
        </div>
        <span className={`text-xl font-black ${isValid ? 'text-[#c8f31d]' : 'text-red-400'}`}>
          {total}%
        </span>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.keys(DIET_PRESETS).map((name) => (
          <button
            key={name}
            onClick={() => handlePreset(name)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              selected === name
                ? 'bg-[#c8f31d] text-black border-[#c8f31d]'
                : 'text-zinc-300 border-zinc-700 hover:border-zinc-500'
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <button
        disabled={!isValid}
        className={`w-full py-3.5 rounded-2xl font-black text-base transition-all ${
          isValid
            ? 'bg-[#c8f31d] text-black hover:scale-[1.01] shadow-[0_0_15px_rgba(200,243,29,0.2)]'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }`}
      >
        Lưu chế độ ăn
      </button>
    </div>
  );
};

export default DietSection;
