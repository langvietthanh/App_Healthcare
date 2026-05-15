import React, { useState } from 'react';
import { Bell, BarChart2, ArrowLeft, ChevronLeft, ChevronRight, Droplets, Footprints, Scale, Play, X, Plus, Minus } from 'lucide-react';

// ─── Biểu đồ cột ──────────────────────────────────────────────────────────────
const BarChart = ({ data, maxVal, goalLine, height = 160, barColor = '#22c55e' }) => (
  <div className="relative" style={{ height }}>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="absolute left-0 right-0 flex items-center" style={{ top: `${(i / 4) * 100}%` }}>
        <span className="text-[9px] text-zinc-500 w-14 shrink-0">{(maxVal - (maxVal / 4) * i).toFixed(0)}</span>
        <div className="flex-1 border-t border-dashed border-zinc-800" />
      </div>
    ))}
    {goalLine != null && maxVal > 0 && (
      <div className="absolute left-14 right-0 border-t-2 border-dashed border-zinc-500"
        style={{ top: `${((maxVal - goalLine) / maxVal) * 100}%` }} />
    )}
    <div className="absolute left-14 right-0 bottom-6 top-0 flex items-end gap-2">
      {data.map((d, i) => {
        const pct = maxVal > 0 ? Math.min((Math.abs(d.value) / maxVal) * 100, 100) : 0;
        return (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-[9px] font-bold text-zinc-500">{d.value}</span>
            <div className="w-full flex flex-col justify-end" style={{ height: '75%' }}>
              <div className="w-full rounded-t" style={{ height: `${Math.max(pct, 2)}%`, backgroundColor: barColor, opacity: d.value === 0 ? 0.2 : 0.85 }} />
            </div>
            <span className="text-[9px] font-bold text-zinc-400 mt-1">{d.label}</span>
          </div>
        );
      })}
    </div>
  </div>
);

// ─── Biểu đồ Cân nặng ──────────────────────────────────────────────────────────
const WeightChart = ({ onBack }) => {
  const data = [
    { label: 'T2', value: 72.5 }, { label: 'T3', value: 72.2 },
    { label: 'T4', value: 71.8 }, { label: 'T5', value: 71.9 },
    { label: 'T6', value: 71.5 }, { label: 'T7', value: 71.3 }, { label: 'CN', value: 71.0 },
  ];

  const [initialWeight, setInitialWeight] = useState('74.0');
  const [currentWeight, setCurrentWeight] = useState('71.0');
  const [targetWeight, setTargetWeight] = useState('68.0');

  const initW = parseFloat(initialWeight) || 74;
  const currW = parseFloat(currentWeight) || 71;
  const targW = parseFloat(targetWeight) || 68;
  const lost = Math.max(0, initW - currW).toFixed(1);
  const remaining = Math.max(0, currW - targW).toFixed(1);
  const progressPct = initW !== targW ? Math.min(Math.max(((initW - currW) / (initW - targW)) * 100, 0), 100) : 0;

  const maxW = Math.max(initW, currW) + 2;
  const minW = Math.min(targW, currW) - 2;
  const chartData2 = data.map(d => ({ ...d, value: Math.max(minW + 0.5, Math.min(maxW - 0.5, d.value)) }));

  return (
    <div className="flex flex-col min-h-full bg-[#111] text-white">
      <div className="flex items-center gap-4 px-6 pt-10 pb-6">
        <button onClick={onBack} className="text-white hover:text-[#c8f31d]"><ArrowLeft size={26} /></button>
        <h1 className="flex-1 text-center text-xl font-bold">Biểu đồ cân nặng</h1>
        <div className="w-6" />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-6 scrollbar-hide">

        {/* Form nhập cân nặng */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
          <h2 className="font-bold text-base mb-2">Nhập thông tin cân nặng</h2>
          {[
            { label: 'Cân nặng ban đầu', value: initialWeight, onChange: setInitialWeight, color: '#f97316' },
            { label: 'Cân nặng hiện tại', value: currentWeight, onChange: setCurrentWeight, color: '#c8f31d' },
            { label: 'Cân nặng mục tiêu', value: targetWeight, onChange: setTargetWeight, color: '#22c55e' },
          ].map((field, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: field.color }} />
                <span className="text-sm font-medium text-zinc-300">{field.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  className="w-24 bg-zinc-800 border border-zinc-700 rounded-xl py-2 px-3 text-white text-center font-black focus:outline-none focus:border-[#c8f31d] transition-colors"
                />
                <span className="text-zinc-500 text-sm font-semibold">kg</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tiến độ */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Cân nặng hiện tại</p>
              <p className="text-4xl font-black text-[#c8f31d]">{currW.toFixed(1)} <span className="text-lg text-zinc-400">kg</span></p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 mb-1">Mục tiêu</p>
              <p className="text-2xl font-black text-white">{targW.toFixed(1)} <span className="text-sm text-zinc-400">kg</span></p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-zinc-500 mb-2">
              <span>{initW} kg</span>
              <span className="text-[#c8f31d] font-bold">{progressPct.toFixed(0)}% hoàn thành</span>
              <span>{targW} kg</span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#f97316] to-[#c8f31d]"
                style={{ width: `${progressPct}%` }} />
            </div>
          </div>
          {/* SVG line chart */}
          <div className="relative h-44 mt-5 mb-2">
            <svg className="w-full h-full" viewBox="0 0 280 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8f31d" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#c8f31d" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 30, 60, 90, 120].map(y => <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="#27272a" strokeWidth="1" strokeDasharray="4" />)}
              <polyline
                points={chartData2.map((d, i) => `${i * 40 + 10},${((maxW - d.value) / (maxW - minW)) * 110 + 5}`).join(' ')}
                fill="none" stroke="#c8f31d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              />
              {chartData2.map((d, i) => (
                <circle key={i} cx={i * 40 + 10} cy={((maxW - d.value) / (maxW - minW)) * 110 + 5}
                  r="4" fill="#c8f31d" stroke="#111" strokeWidth="2" />
              ))}
            </svg>
          </div>
          <div className="flex justify-between">
            {data.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-zinc-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Đã giảm', value: `${lost} kg`, color: '#22c55e' },
            { label: 'Còn lại', value: `${remaining} kg`, color: '#f97316' },
            { label: 'Ngày theo dõi', value: '14', color: '#c8f31d' },
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center">
              <p className="text-xs text-zinc-500 mb-2">{item.label}</p>
              <p className="font-black text-lg" style={{ color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Trang Thống kê ───────────────────────────────────────────────────────────
const StatisticsPage = ({ onBack }) => {
  const [mode, setMode] = useState('week');
  const [offset, setOffset] = useState(0);
  const goalKcal = 2852;
  const isWeek = mode === 'week';
  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const monthWeeks = ['T1', 'T2', 'T3', 'T4'];
  const chartData = isWeek ? weekDays.map(d => ({ label: d, value: 0 })) : monthWeeks.map(w => ({ label: w, value: 0 }));
  const surplusChart = isWeek ? weekDays.map((d, i) => ({ label: d, value: i < 5 ? -goalKcal : 0 })) : monthWeeks.map((w, i) => ({ label: w, value: i < 3 ? -goalKcal * 7 : 0 }));
  const maxConsumption = isWeek ? goalKcal * 1.1 : goalKcal * 7 * 1.1;
  const maxSurplus = isWeek ? 3027 : 3027 * 7;
  return (
    <div className="flex flex-col min-h-full bg-[#111] text-white">
      <div className="flex items-center gap-4 px-6 pt-10 pb-6">
        <button onClick={onBack} className="text-white hover:text-[#c8f31d]"><ArrowLeft size={26} /></button>
        <h1 className="flex-1 text-center text-xl font-bold">Thống kê</h1>
        <div className="w-6" />
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-6 scrollbar-hide">
        <div className="bg-zinc-800 rounded-2xl flex p-1.5">
          {['week', 'month'].map((m, i) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === m ? 'bg-[#c8f31d] text-black shadow-md' : 'text-zinc-400 hover:text-white'}`}>
              {i === 0 ? 'Theo tuần' : 'Theo tháng'}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between px-2">
          <button onClick={() => setOffset(o => o - 1)} className="text-zinc-300 hover:text-[#c8f31d]"><ChevronLeft size={24} /></button>
          <span className="font-bold text-lg">{isWeek ? '11/5 - 17/5' : 'Tháng 5/2025'}</span>
          <button onClick={() => setOffset(o => o + 1)} className="text-zinc-300 hover:text-[#c8f31d]"><ChevronRight size={24} /></button>
        </div>
        {[{ title: 'Mức tiêu thụ Calo', data: chartData, max: maxConsumption, goal: goalKcal, color: '#22c55e' },
        { title: 'Biểu đồ thặng dư Calo', data: surplusChart, max: maxSurplus, goal: 0, color: '#22c55e' }
        ].map((card, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg">
            <h2 className="font-bold text-base mb-5">{card.title}</h2>
            <BarChart data={card.data} maxVal={card.max} goalLine={card.goal} height={170} barColor={card.color} />
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2"><div className="w-6 border-t-2 border-dashed border-zinc-400" /><span className="text-xs text-zinc-400">Mục tiêu</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f97316]" /><span className="text-xs text-zinc-400">Thực tế</span></div>
            </div>
          </div>
        ))}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg">
          <h2 className="font-bold text-base mb-4">Tóm tắt {isWeek ? 'tuần' : 'tháng'}</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Tổng Calo nạp', value: '0 kcal', color: '#f97316' },
              { label: 'Mục tiêu', value: `${(goalKcal * (isWeek ? 7 : 30)).toLocaleString()} kcal`, color: '#c8f31d' },
              { label: 'Thặng dư TB', value: isWeek ? '-2852 kcal' : '-85.560 kcal', color: '#ef4444' },
              { label: isWeek ? 'Ngày đạt mục tiêu' : 'Tuần đạt mục tiêu', value: '0', color: '#22c55e' },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-800 rounded-2xl p-4">
                <p className="text-[11px] text-zinc-500 mb-2">{item.label}</p>
                <p className="font-black text-lg" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard chính ──────────────────────────────────────────────────────────
const Dashboard = () => {
  const [page, setPage] = useState('home'); // 'home'|'stats'|'weight'
  const [water, setWater] = useState(1500);
  const [steps] = useState(4328);
  const [showWorkoutBanner, setShowWorkoutBanner] = useState(true);

  if (page === 'stats') return <StatisticsPage onBack={() => setPage('home')} />;
  if (page === 'weight') return <WeightChart onBack={() => setPage('home')} />;

  const waterGoal = 2500;
  const stepsGoal = 10000;
  const waterPct = Math.min((water / waterGoal) * 100, 100);
  const stepsPct = Math.min((steps / stepsGoal) * 100, 100);

  return (
    <div className="flex flex-col pb-6 text-white bg-[#111]">

      {/* Header */}
      <div className="bg-[#c8f31d] rounded-b-[40px] px-6 pt-12 pb-10 text-black relative z-10 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPage('stats')} className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center hover:bg-black/20 transition-colors" title="Xem thống kê">
              <BarChart2 size={22} className="text-black" />
            </button>
            <button className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center hover:bg-black/20 transition-colors">
              <Bell size={22} className="text-black" />
            </button>
          </div>
        </div>
        <div>
          <p className="text-xl font-extrabold mb-1 text-white">Xin chào, Buổi sáng tốt lành 👋</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Piyush !</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-4 relative z-20 space-y-5 pt-8">

        {/* Banner bắt đầu buổi tập */}
        {showWorkoutBanner && (
          <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700 rounded-3xl p-5 flex items-center gap-4 relative shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#c8f31d]/10 to-transparent pointer-events-none" />
            <div className="w-14 h-14 bg-[#c8f31d] rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(200,243,29,0.4)]">
              <Play size={26} className="text-black fill-black" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-400 font-medium mb-1">Buổi tập hôm nay</p>
              <h3 className="font-black text-white text-base">Bắt đầu luyện tập ngay!</h3>
              <p className="text-xs text-zinc-500 mt-0.5">3 bài tập · ~45 phút</p>
            </div>
            <button onClick={() => setShowWorkoutBanner(false)} className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-400 transition-colors">
              <X size={18} />
            </button>
          </div>
        )}

        {/* 3 Widget hàng ngang */}
        <div className="grid grid-cols-3 gap-4">

          {/* Widget: Cân nặng */}
          <button onClick={() => setPage('weight')} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center gap-2 hover:border-[#c8f31d]/50 hover:bg-zinc-800 transition-all shadow-lg group">
            <div className="w-11 h-11 bg-[#c8f31d]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#c8f31d]/20 transition-colors">
              <Scale size={22} className="text-[#c8f31d]" />
            </div>
            <p className="text-xl font-black text-white">71.0</p>
            <p className="text-[10px] text-zinc-500 font-semibold">kg</p>
          </button>

          {/* Widget: Nước */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center gap-2 shadow-lg">
            <div className="w-11 h-11 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <Droplets size={22} className="text-blue-400" />
            </div>
            <p className="text-xl font-black text-white">{(water / 1000).toFixed(1)}</p>
            <p className="text-[10px] text-zinc-500 font-semibold">/ {waterGoal / 1000}L</p>
            {/* Progress */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${waterPct}%` }} />
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={() => setWater(w => Math.max(0, w - 250))} className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center text-white hover:bg-zinc-600 transition-colors">
                <Minus size={12} />
              </button>
              <button onClick={() => setWater(w => Math.min(waterGoal, w + 250))} className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-400 transition-colors">
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Widget: Bước chân */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center gap-2 shadow-lg">
            <div className="w-11 h-11 bg-orange-500/10 rounded-2xl flex items-center justify-center">
              <Footprints size={22} className="text-orange-400" />
            </div>
            <p className="text-xl font-black text-white">{steps.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500 font-semibold">/ {stepsGoal.toLocaleString()}</p>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${stepsPct}%` }} />
            </div>
            <p className="text-[10px] text-[#c8f31d] font-bold mt-1">{stepsPct.toFixed(0)}%</p>
          </div>
        </div>

        {/* Nhãn mô tả cho 3 widget */}
        <div className="grid grid-cols-3 gap-4 -mt-3">
          {['Cân nặng', 'Lượng nước', 'Bước chân'].map((label, i) => (
            <p key={i} className="text-center text-[11px] text-zinc-500 font-semibold">{label}</p>
          ))}
        </div>


      </div>
    </div>
  );
};

export default Dashboard;
