/**
 * Tác dụng của file: Màn hình nhập cân nặng (ban đầu, hiện tại, mục tiêu), tính toán lượng cân nặng đã giảm/còn lại, vẽ biểu đồ SVG đường cong tiến độ cân nặng theo tuần
 * File này dùng cho component cha nào là chính: Dashboard (src/pages/user/dashboard/index.jsx)
 */
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const WeightChart = ({ onBack }) => {
  const data = [
    { label: 'T2', value: 72.5 },
    { label: 'T3', value: 72.2 },
    { label: 'T4', value: 71.8 },
    { label: 'T5', value: 71.9 },
    { label: 'T6', value: 71.5 },
    { label: 'T7', value: 71.3 },
    { label: 'CN', value: 71.0 },
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
  const chartData2 = data.map((d) => ({
    ...d,
    value: Math.max(minW + 0.5, Math.min(maxW - 0.5, d.value)),
  }));

  return (
    <div className="flex flex-col min-h-full bg-[#111] text-white">
      <div className="flex items-center gap-4 px-6 pt-10 pb-6">
        <button onClick={onBack} className="text-white hover:text-[#c8f31d]">
          <ArrowLeft size={26} />
        </button>
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
                  onChange={(e) => field.onChange(e.target.value)}
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
              <p className="text-4xl font-black text-[#c8f31d]">
                {currW.toFixed(1)} <span className="text-lg text-zinc-400">kg</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 mb-1">Mục tiêu</p>
              <p className="text-2xl font-black text-white">
                {targW.toFixed(1)} <span className="text-sm text-zinc-400">kg</span>
              </p>
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
              <div
                className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-[#f97316] to-[#c8f31d]"
                style={{ width: `${progressPct}%` }}
              />
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
              {[0, 30, 60, 90, 120].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="280"
                  y2={y}
                  stroke="#27272a"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              ))}
              <polyline
                points={chartData2
                  .map((d, i) => `${i * 40 + 10},${((maxW - d.value) / (maxW - minW)) * 110 + 5}`)
                  .join(' ')}
                fill="none"
                stroke="#c8f31d"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {chartData2.map((d, i) => (
                <circle
                  key={i}
                  cx={i * 40 + 10}
                  cy={((maxW - d.value) / (maxW - minW)) * 110 + 5}
                  r="4"
                  fill="#c8f31d"
                  stroke="#111"
                  strokeWidth="2"
                />
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
              <p className="font-black text-lg" style={{ color: item.color }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeightChart;
