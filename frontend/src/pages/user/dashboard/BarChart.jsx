const BarChart = ({ data, maxVal, minVal = 0, goalLine, height = 160, isDynamicColor = false }) => {
  const range = (maxVal - minVal) || 1;
  const zeroPercent = (maxVal / range) * 100; // Khoảng cách % từ đỉnh biểu đồ đến đường 0

  return (
    // GIAO DIỆN BAR CHART
    <div className="relative" style={{ height }}>
      {/* Các vạch ngang đằng sau */}
      <div className="absolute top-0 bottom-6 left-0 right-0">
        {[...Array(5)].map((_, i) => {
          const val = maxVal - (range / 4) * i;
          return (
            <div key={i} className="absolute left-0 right-0 flex items-center" style={{ top: `${(i / 4) * 100}%` }}>
              <span className="text-[9px] text-zinc-500 w-14 shrink-0">{val.toFixed(0)}</span>
              <div className="flex-1 border-t border-dashed border-zinc-800" />
            </div>
          );
        })}
      </div>

      {/* Đường mục tiêu (Mức tiêu thụ/Thặng dư) */}
      {goalLine != null && maxVal > 0 && (
        <div className="absolute top-0 bottom-6 left-14 right-0">
          <div className="absolute left-0 right-0 border-t-2 border-dashed border-zinc-500"
            style={{ top: `${((maxVal - goalLine) / range) * 100}%` }} />
        </div>
      )}

      {/* Vùng chứa các cột dọc */}
      <div className="absolute left-14 right-0 bottom-6 top-0 flex gap-2">
        {data.map((d, i) => {
          const val = d.value || 0;
          const pctHeight = (Math.abs(val) / range) * 100;

          return (
            <div key={i} className="flex flex-col items-center flex-1 h-full relative">
              {/* Text hiển thị giá trị nằm trên/dưới tùy theo số dương/âm */}
              {val >= 0 ? (
                <span className="absolute text-[9px] font-bold text-zinc-500"
                  style={{ bottom: `${100 - zeroPercent + pctHeight}%`, marginBottom: '4px' }}>
                  {val}
                </span>
              ) : (
                <span className="absolute text-[9px] font-bold text-red-500"
                  style={{ top: `${zeroPercent + pctHeight}%`, marginTop: '4px' }}>
                  {val}
                </span>
              )}

              {/* Bản thân thanh dọc */}
              <div
                className={`absolute w-full ${val >= 0 ? 'rounded-t' : 'rounded-b'}`}
                style={{
                  height: `${Math.max(pctHeight, 1)}%`,
                  background: isDynamicColor && val > goalLine
                    ? `linear-gradient(to top, ${"#c8f31d"} ${(goalLine / val) * 100}%, #ef4444 ${(goalLine / val) * 100}%)`
                    : (val >= 0 ? "#c8f31d" : '#ef4444'),
                  opacity: val === 0 ? 0.2 : 0.85,
                  bottom: val >= 0 ? `${100 - zeroPercent}%` : 'auto',
                  top: val < 0 ? `${zeroPercent}%` : 'auto'
                }}
              />

              {/* Label ngày/tháng/tuần */}
              <span className="absolute -bottom-6 text-[9px] font-bold text-zinc-400">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;
