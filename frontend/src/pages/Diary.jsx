import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';

// ─── Chế độ ăn ──────────────────────────────────────────────────────────
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
    setMacros(prev => ({ ...prev, [key]: Math.max(0, Math.min(100, Number(val))) }));
  };
  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Chế độ ăn</h2>
        <span className="text-xs text-zinc-500">Tỷ lệ dinh dưỡng</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {macroConfig.map(m => (
          <div key={m.key} className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold" style={{ color: m.color }}>{m.label}</span>
            <input type="number" min="0" max="100" value={macros[m.key]}
              onChange={e => handleChange(m.key, e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-2 text-white text-center text-xl font-black focus:outline-none focus:border-[#c8f31d] transition-colors"
              style={{ borderColor: selected === 'Tùy Chỉnh' ? m.color : undefined }}
            />
            <span className="text-[10px] text-zinc-500">%</span>
          </div>
        ))}
      </div>
      <div className="space-y-2 mb-5">
        {macroConfig.map(m => (
          <div key={m.key} className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-500 w-16 shrink-0">{m.label}</span>
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${macros[m.key]}%`, backgroundColor: m.color }} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 w-8 text-right">{macros[m.key]}%</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between py-3 border-t border-b border-zinc-800 mb-5">
        <div>
          <span className="font-bold text-white">% Tổng</span>
          <p className="text-[10px] text-zinc-500 mt-0.5">Các chất dinh dưỡng phải tổng bằng 100%</p>
        </div>
        <span className={`text-xl font-black ${isValid ? 'text-[#c8f31d]' : 'text-red-400'}`}>{total}%</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.keys(DIET_PRESETS).map(name => (
          <button key={name} onClick={() => handlePreset(name)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selected === name ? 'bg-[#c8f31d] text-black border-[#c8f31d]' : 'text-zinc-300 border-zinc-700 hover:border-zinc-500'
              }`}>{name}</button>
        ))}
      </div>
      <button
        disabled={!isValid}
        className={`w-full py-3.5 rounded-2xl font-black text-base transition-all ${isValid ? 'bg-[#c8f31d] text-black hover:scale-[1.01] shadow-[0_0_15px_rgba(200,243,29,0.2)]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}>
        Lưu chế độ ăn
      </button>
    </div>
  );
};

const StomachIcon = ({ level = 0, current = 0, goal = 2000 }) => {
  const percentage = Math.max(0, Math.min(100, level));

  return (
    <div className="relative flex items-center justify-center p-2">
      {/* Container Oval Dọc */}
      <div className="relative w-[160px] h-[240px] rounded-[100px] border-[6px] border-zinc-800 bg-zinc-900 overflow-hidden shadow-inner flex flex-col items-center justify-center">

        {/* Nước gợn sóng 1 (Mờ hơn, sóng phía sau) */}
        <div
          className="absolute left-1/2 w-[600px] h-[600px] bg-[#c8f31d]/40 rounded-[43%] animate-[spin_7s_linear_infinite] transition-all duration-1000 ease-in-out"
          style={{
            top: `calc(${100 - percentage}% - 10px)`,
            marginLeft: '-300px'
          }}
        ></div>

        {/* Nước gợn sóng 2 (Đậm hơn, sóng phía trước) */}
        <div
          className="absolute left-1/2 w-[600px] h-[600px] bg-[#c8f31d] rounded-[40%] animate-[spin_5s_linear_infinite] transition-all duration-1000 ease-in-out drop-shadow-[0_-5px_15px_rgba(200,243,29,0.3)]"
          style={{
            top: `calc(${100 - percentage}% + 5px)`,
            marginLeft: '-300px'
          }}
        ></div>

        {/* Nội dung chữ đè lên trên sóng */}
        <div className="relative z-10 text-center flex flex-col items-center mt-4">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-black bg-[#c8f31d] px-3 py-1 rounded-full mb-2 shadow-lg">
            Đã nạp
          </span>
          <span className="text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none">
            {current}
          </span>
        </div>
      </div>
    </div>
  );
};

const CircularMacro = ({ label, current, total, color, unit = 'g' }) => {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((current / total) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center w-[75px] h-[75px]">
        <svg className="w-full h-full transform -rotate-90 drop-shadow-md" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
          <circle cx="35" cy="35" r={radius} stroke={color} strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center mt-0.5">
          <span className="text-sm font-bold text-white">{current}</span>
          <span className="text-[9px] text-zinc-500 font-medium">/{total}{unit}</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{label}</span>
    </div>
  );
};

const BatteryInfo = ({ current, goal }) => {
  const isOver = current > goal;
  const remaining = isOver ? current - goal : goal - current;
  const percentage = Math.min((current / goal) * 100, 100);

  let color = "#c8f31d"; // Xanh lá mạ
  if (isOver) {
    color = "#ef4444"; // Đỏ (Vượt mức)
  } else if (percentage > 85) {
    color = "#f59e0b"; // Vàng cam (Sắp đầy)
  }

  return (
    <div className="flex items-center gap-5 bg-zinc-800/40 p-4 rounded-2xl border border-zinc-700/50 w-full hover:bg-zinc-800 transition-colors">
      <div className="relative w-10 h-16 border-2 border-zinc-500 rounded-md p-[2px] flex flex-col justify-end opacity-90">
        {/* Battery Nipple */}
        <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-zinc-500 rounded-t-sm"></div>
        {/* Battery Fill (Vertical) */}
        <div className="w-full rounded-sm transition-all duration-1000 ease-out" style={{ height: `${percentage}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}></div>
      </div>
      <div className="flex flex-col">
        <span className="text-[12px] text-zinc-400 font-semibold uppercase tracking-widest mb-1">
          {isOver ? "Vượt mức (Quá calo)" : "Còn lại có thể nạp"}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-3xl font-black ${isOver ? 'text-red-500' : 'text-white'}`}>{remaining}</span>
          <span className="text-sm font-bold text-zinc-500">/ {goal} kcal</span>
        </div>
      </div>
    </div>
  );
};

// WeeklyView component
const WeeklyView = () => {
  const weeklyData = [
    { day: 'T2', kcal: 0, max: 2752 },
    { day: 'T3', kcal: 0, max: 2752 },
    { day: 'T4', kcal: 0, max: 2752 },
    { day: 'T5', kcal: 0, max: 2752 },
    { day: 'T6', kcal: 0, max: 2752 },
    { day: 'T7', kcal: 0, max: 2752 },
    { day: 'CN', kcal: 0, max: 2752 },
  ];
  const totalWeekKcal = 0;
  const totalWeekGoal = 2752 * 7;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min((totalWeekKcal / totalWeekGoal) * 100, 100);
  const offset = circumference - (pct / 100) * circumference;
  const macros = [
    { label: 'Carbs', icon: '🌾', current: 0, total: 1925, color: '#eab308' },
    { label: 'Chất đạm', icon: '🥩', current: 0, total: 1925, color: '#ef4444' },
    { label: 'Chất béo', icon: '🥑', current: 0, total: 427, color: '#22c55e' },
  ];

  return (
    <div>
      {/* Biểu đồ cột + vòng tròn */}
      <div className="flex items-end gap-4 mb-8">
        {/* Vòng tròn tổng calo */}
        <div className="flex-none flex flex-col items-center justify-center">
          <div className="relative w-[110px] h-[110px] flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r={radius} stroke="#3f3f46" strokeWidth="10" fill="transparent" />
              <circle cx="65" cy="65" r={radius} stroke="#f97316" strokeWidth="10" fill="transparent"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-[#f97316] leading-none">{totalWeekKcal}</span>
              <div className="w-8 h-[2px] bg-white/30 my-1"></div>
              <span className="text-xs font-bold text-zinc-400">{totalWeekGoal}</span>
            </div>
          </div>
        </div>

        {/* Biểu đồ cột 7 ngày */}
        <div className="flex-1 flex items-end justify-between gap-1">
          {weeklyData.map((d, i) => {
            const barPct = d.max > 0 ? Math.max((d.kcal / d.max) * 100, 4) : 4;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-[9px] font-bold text-zinc-500">{d.max}</span>
                <div className="w-full rounded-t-lg relative" style={{ height: '90px', backgroundColor: '#27272a' }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg"
                    style={{ height: `${barPct}%`, backgroundColor: '#27272a', opacity: 0.5 }}
                  />
                </div>
                <span className="text-[10px] font-bold text-zinc-400">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dấu ? */}
      <div className="flex justify-end mb-6">
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold text-sm cursor-pointer hover:bg-zinc-700 transition-colors">?</div>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed border-zinc-700 mb-6" />

      {/* Macros thanh tiến trình */}
      <div className="space-y-5">
        {macros.map((m) => {
          const pct = m.total > 0 ? (m.current / m.total) * 100 : 0;
          return (
            <div key={m.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-base flex items-center gap-2">
                  <span>{m.icon}</span> {m.label}
                </span>
                <span className="text-sm font-bold">
                  <span className="text-white font-black">{m.current}</span>
                  <span className="text-zinc-500">/{m.total}g</span>
                </span>
              </div>
              <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, backgroundColor: m.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Diary = () => {
  // Thay đổi currentKcal để test (ví dụ thử nhập 3000 để thấy chuyển màu đỏ)
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'week'
  const currentKcal = 593;
  const goalKcal = 2752;
  const percentage = (currentKcal / goalKcal) * 100;

  return (
    <div className="flex flex-col min-h-full pb-10 text-white bg-transparent">

      {/* Header */}
      <div className="flex justify-between items-center px-10 py-10">
        <div>
          <h1 className="text-3xl font-extrabold mb-1 tracking-tight">Hôm nay, 7 Tháng 5</h1>
          <p className="text-sm text-zinc-400 font-medium">🎉 Bạn đã giảm 3.0 kg trong 44 ngày. Cố lên nhé!</p>
        </div>
        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-[#c8f31d] shadow-lg cursor-pointer hover:bg-zinc-700 transition-colors">
          <Calendar size={22} strokeWidth={2.5} />
        </div>
      </div>

      {/* Date Picker (Horizontal) */}
      <div className="flex justify-between items-center px-10 mb-10 text-xl font-bold">
        <span className="text-zinc-700 cursor-pointer hover:text-zinc-500 transition-colors">4</span>
        <span className="text-zinc-600 cursor-pointer hover:text-zinc-500 transition-colors">5</span>
        <span className="text-zinc-500 cursor-pointer hover:text-zinc-400 transition-colors">6</span>
        <div className="w-12 h-12 rounded-full bg-[#c8f31d] text-black flex items-center justify-center shadow-[0_0_15px_rgba(200,243,29,0.3)]">7</div>
        <span className="text-zinc-500 cursor-pointer hover:text-zinc-400 transition-colors">8</span>
        <span className="text-zinc-600 cursor-pointer hover:text-zinc-500 transition-colors">9</span>
        <span className="text-zinc-700 cursor-pointer hover:text-zinc-500 transition-colors">10</span>
      </div>

      {/* Main Card */}
      <div className="px-8 mb-8">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">

          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight">Calo & Dinh dưỡng</h2>
            <div className="bg-zinc-800/80 rounded-xl flex p-1 border border-zinc-700/50">
              <button
                onClick={() => setViewMode('day')}
                className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'day' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
              >Ngày</button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'week' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                  }`}
              >Tuần</button>
            </div>
          </div>

          {viewMode === 'day' ? (
            <>
              <div className="flex items-center justify-between mb-12 px-2">
                {/* Left: Stomach Progress */}
                <div className="flex-1 flex justify-center">
                  <StomachIcon level={percentage} current={currentKcal} goal={goalKcal} />
                </div>
                {/* Right: Unified Battery */}
                <div className="flex-1 flex flex-col justify-center ml-8">
                  <BatteryInfo current={currentKcal} goal={goalKcal} />
                </div>
              </div>
              <div className="relative w-full mb-8 flex items-center justify-center">
                <div className="absolute w-full border-t-2 border-dashed border-zinc-800"></div>
              </div>
              <div className="flex justify-between items-center px-1">
                <CircularMacro label="Carbs" current={1} total={275} color="#eab308" />
                <CircularMacro label="Protein" current={118} total={275} color="#ef4444" />
                <CircularMacro label="Fat" current={10} total={61} color="#22c55e" />
                <CircularMacro label="Nước" current={1.5} total={2} color="#0ea5e9" unit="L" />
              </div>
            </>
          ) : (
            <WeeklyView />
          )}

        </div>
      </div>

      {/* Chế độ ăn */}
      <div className="px-8 mb-8">
        <DietSection />
      </div>

    </div>
  );
};

export default Diary;
