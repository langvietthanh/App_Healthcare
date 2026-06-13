import React from 'react';
import { TrendingUp } from 'lucide-react';

const NewUsersChart = ({ chartMode, setChartMode, chartData, maxVal }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-bold text-white text-base">Người dùng mới</h2>
          <p className="text-xs text-zinc-500 mt-1">Thống kê theo {chartMode === 'week' ? 'tuần' : 'tháng'}</p>
        </div>
        <div className="flex gap-2 bg-zinc-800 rounded-xl p-1">
          {[{ key: 'week', label: 'Theo tuần' }, { key: 'month', label: 'Theo tháng' }].map(m => (
            <button key={m.key} onClick={() => setChartMode(m.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${chartMode === m.key ? 'bg-[#c8f31d] text-black' : 'text-zinc-400 hover:text-white'}`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-2 h-48">
        {chartData.map((d, i) => (
          <div key={i} className="flex-1 h-full flex flex-col items-center gap-2 group">
            <div className="relative w-full flex flex-col justify-end" style={{ height: '85%' }}>
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-700 text-white text-[10px] font-bold px-2 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 text-center shadow-lg">
                <div className="text-[#c8f31d]">{d.value} users</div>
                {d.dateRange && <div className="text-[8px] text-zinc-300 font-normal">{d.dateRange}</div>}
              </div>
              <div className="w-full rounded-t-lg transition-all duration-500"
                style={{ height: `${(d.value / maxVal) * 100}%`, backgroundColor: '#c8f31d', opacity: 0.6 + (d.value / maxVal) * 0.4 }} />
            </div>
            <span className="text-[9px] text-zinc-500 font-medium">{d.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-6 mt-6 pt-5 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#c8f31d]" />
          <span className="text-xs text-zinc-400">Người dùng mới</span>
        </div>
        <span className="text-xs text-zinc-500">
          Tổng: <span className="text-[#c8f31d] font-black">{chartData.reduce((s, d) => s + d.value, 0).toLocaleString()}</span>
        </span>
      </div>
    </div>
  );
};

export default NewUsersChart;
