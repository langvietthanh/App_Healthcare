import { useState, useEffect } from 'react';
import { ArrowLeft, Edit2, Check } from 'lucide-react';
import { useDailyLog } from '../../../providers/user';

const WeightChartHeader = ({ onBack }) => (
  // GIAO DIỆN WEIGHT CHART HEADER
  <div className="flex items-center gap-4 px-6 pt-10 pb-6">
    <button onClick={onBack} className="text-white hover:text-[#c8f31d]">
      <ArrowLeft size={26} />
    </button>
    <h1 className="flex-1 text-center text-xl font-bold">Biểu đồ cân nặng</h1>
    <div className="w-6" />
  </div>
);

const WeightInputForm = ({ initialWeight, setInitialWeight, currentWeight, setCurrentWeight, targetWeight, setTargetWeight, onSave }) => {
  const [editingField, setEditingField] = useState(null); // 'initial', 'target', 'current', null
  const [tempInitial, setTempInitial] = useState(initialWeight);
  const [tempCurrent, setTempCurrent] = useState(currentWeight);
  const [tempTarget, setTempTarget] = useState(targetWeight);

  const handleSave = (field) => {
    if (field === 'initial') { setInitialWeight(tempInitial); if (onSave) onSave(field, parseFloat(tempInitial)); }
    if (field === 'current') { setCurrentWeight(tempCurrent); if (onSave) onSave(field, parseFloat(tempCurrent)); }
    if (field === 'target') { setTargetWeight(tempTarget); if (onSave) onSave(field, parseFloat(tempTarget)); }
    setEditingField(null);
  };

  return (
    // GIAO DIỆN WEIGHT INPUT FORM
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: 'initial', label: 'Ban đầu', value: initialWeight, tempValue: tempInitial, setTemp: setTempInitial, color: '#f97316' },
          { id: 'current', label: 'Hiện tại', value: currentWeight, tempValue: tempCurrent, setTemp: setTempCurrent, color: '#c8f31d' },
          { id: 'target', label: 'Mục tiêu', value: targetWeight, tempValue: tempTarget, setTemp: setTempTarget, color: '#22c55e' },
        ].map((field, i) => (
          <div key={field.id} className={`flex flex-col items-center gap-2 ${i === 1 ? 'border-x border-zinc-800' : ''}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: field.color }} />
              <span className="text-xs font-medium text-zinc-400 whitespace-nowrap">{field.label}</span>
            </div>

            <div className="flex items-center gap-2 h-9 justify-center">
              {editingField === field.id ? (
                <>
                  <input
                    type="number"
                    step="0.1"
                    value={field.tempValue}
                    onChange={(e) => field.setTemp(e.target.value)}
                    className="w-14 bg-zinc-800 border border-zinc-700 rounded-lg py-1 text-white text-center font-bold focus:outline-none focus:border-[#c8f31d] text-sm"
                  />
                  <button
                    onClick={() => handleSave(field.id)}
                    className="text-[#c8f31d] bg-zinc-800 hover:bg-zinc-700 p-1.5 rounded-lg transition-colors"
                  >
                    <Check size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-white">
                    {field.value} <span className="text-xs text-zinc-500 font-semibold">kg</span>
                  </span>
                  <button
                    onClick={() => {
                      field.setTemp(field.value);
                      setEditingField(field.id);
                    }}
                    className="text-zinc-500 hover:text-white p-1 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WeightProgressChart = ({
  viewMode, setViewMode, currW, initW, targW, progressPct,
  svgWidth, data, chartData2, maxW, minW
}) => (
  // GIAO DIỆN WEIGHT PROGRESS CHART
  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5">
    {/* Bộ lọc chế độ */}
    <div className="flex justify-center mb-6 mt-1">
      <div className="bg-zinc-800/80 rounded-xl flex p-1 border border-zinc-700/50">
        {['day', 'week', 'month'].map(mode => {
          const label = mode === 'day' ? 'Ngày' : mode === 'week' ? 'Tuần' : 'Tháng';
          return (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${viewMode === mode ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
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
    {/* Chart Container */}
    <div className="overflow-x-auto scrollbar-hide w-full mt-5 mb-2">
      <div style={{ minWidth: `${svgWidth}px` }}>
        {/* SVG line chart */}
        <div className="relative h-44 w-full">
          <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} 120`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8f31d" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#c8f31d" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 30, 60, 90, 120].map((y) => (
              <line key={y} x1="0" y1={y} x2={svgWidth} y2={y} stroke="#27272a" strokeWidth="1" strokeDasharray="4" />
            ))}
            <polyline
              points={chartData2.map((d, i) => d.value !== null ? `${i * 40 + 20},${((maxW - d.value) / (maxW - minW)) * 110 + 5}` : null).filter(Boolean).join(' ')}
              fill="none" stroke="#c8f31d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
            {chartData2.map((d, i) => d.value !== null && (
              <circle key={i} cx={i * 40 + 20} cy={((maxW - d.value) / (maxW - minW)) * 110 + 5} r="4" fill="#c8f31d" stroke="#111" strokeWidth="2" />
            ))}
          </svg>
        </div>

        {/* Labels */}
        <div className="relative w-full mt-2 h-6">
          {data.map((d, i) => {
            const xPos = i * 40 + 20;
            const leftPct = (xPos / svgWidth) * 100;
            return (
              <div key={i} className="absolute flex flex-col items-center justify-start" style={{ left: `calc(${leftPct}% - 20px)`, width: '40px' }}>
                <span className="text-[10px] font-bold text-zinc-400 whitespace-nowrap">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

const WeightChart = ({ onBack }) => {
  const { state, ensureTodayWeight, fetchWeightHistory, updateTodayWeight, updatePhysicalDetail, updateGoals } = useDailyLog();
  const { user, weightHistory } = state;

  const [viewMode, setViewMode] = useState('day');
  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [initialWeight, setInitialWeight] = useState('');

  // Đồng bộ dữ liệu từ user object khi được load
  useEffect(() => {
    if (user) {
      if (!initialWeight && user.physicalDetail?.weight) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInitialWeight(String(user.physicalDetail.weight));
      }
      if (!targetWeight && user.goals?.weightGoal) {
        setTargetWeight(String(user.goals.weightGoal));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const init = async () => {
      await ensureTodayWeight();
      const now = new Date();
      let from, to;
      if (viewMode === 'day' || viewMode === 'week') {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const formatLocal = (d) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        from = formatLocal(firstDay);
        to = formatLocal(lastDay);
      } else {
        const firstDay = new Date(now.getFullYear(), 0, 1);
        const lastDay = new Date(now.getFullYear(), 11, 31);
        const formatLocal = (d) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };
        from = formatLocal(firstDay);
        to = formatLocal(lastDay);
      }
      await fetchWeightHistory(from, to, viewMode, initialWeight, currentWeight);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, initialWeight]);

  useEffect(() => {
    // Chỉ khởi tạo currentWeight từ biểu đồ ở lần đầu tiên (tránh bị thay đổi khi đổi viewMode)
    if (currentWeight === '' && weightHistory && weightHistory.length > 0) {
      const validWeights = weightHistory.filter(item => item.value !== null);
      if (validWeights.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentWeight(String(validWeights[validWeights.length - 1].value));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weightHistory]);

  // Đã gỡ bỏ useEffect debounce của currentWeight vì dùng nút Save tường minh

  const data = weightHistory.length ? weightHistory : [];

  const initW = parseFloat(initialWeight) || 73;
  const currW = parseFloat(currentWeight) || 71;
  const targW = parseFloat(targetWeight) || 68;
  const progressPct = initW !== targW ? Math.min(Math.max(((initW - currW) / (initW - targW)) * 100, 0), 100) : 0;

  const maxW = Math.max(initW, currW) + 2;
  const minW = Math.min(targW, currW) - 2;
  const chartData2 = data.map((d) => ({
    ...d,
    value: d.value !== null ? Math.max(minW + 0.5, Math.min(maxW - 0.5, d.value)) : null,
  }));

  const svgWidth = Math.max(data.length * 40 + 20, 280);

  return (
    <div className="flex flex-col min-h-full bg-[#111] text-white">
      <WeightChartHeader onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-6 pb-10 space-y-6 scrollbar-hide">
        <WeightInputForm
          initialWeight={initialWeight} setInitialWeight={setInitialWeight}
          currentWeight={currentWeight} setCurrentWeight={setCurrentWeight}
          targetWeight={targetWeight} setTargetWeight={setTargetWeight}
          onSave={async (field, val) => {
            if (!val) return;
            if (field === 'initial') await updatePhysicalDetail({ weight: val });
            if (field === 'current') await updateTodayWeight(val);
            if (field === 'target') await updateGoals({ weightGoal: val });
          }}
        />
        <WeightProgressChart
          viewMode={viewMode} setViewMode={setViewMode}
          currW={currW} initW={initW} targW={targW} progressPct={progressPct}
          svgWidth={svgWidth} data={data} chartData2={chartData2} maxW={maxW} minW={minW}
        />
      </div>
    </div>
  );
};

export default WeightChart;
