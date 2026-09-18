const BatteryGraphic = ({ percentage, color }) => (
  // GIAO DIỆN BATTERY GRAPHIC
  <div className="relative w-10 h-16 border-2 border-zinc-500 rounded-md p-[2px] flex flex-col justify-end opacity-90">
    {/* Battery Nipple */}
    <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-4 h-1.5 bg-zinc-500 rounded-t-sm"></div>
    {/* Battery Fill (Vertical) */}
    <div className="w-full rounded-sm transition-all duration-1000 ease-out" style={{ height: `${percentage}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}></div>
  </div>
);

const BatteryText = ({ isOver, remaining, goal }) => (
  // GIAO DIỆN BATTERY TEXT
  <div className="flex flex-col">
    <span className="text-[12px] text-zinc-400 font-semibold uppercase tracking-widest mb-1">
      {isOver ? "Vượt mức (Quá calo)" : "Còn lại có thể nạp"}
    </span>
    <div className="flex items-baseline gap-1.5">
      <span className={`text-3xl font-black ${isOver ? 'text-red-500' : 'text-white'}`}>{remaining}</span>
      <span className="text-sm font-bold text-zinc-500">/ {goal} kcal</span>
    </div>
  </div>
);

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
    // GIAO DIỆN BATTERY INFO
    <div className="flex items-center gap-5 bg-zinc-800/40 p-4 rounded-2xl border border-zinc-700/50 w-full hover:bg-zinc-800 transition-colors">
      <BatteryGraphic percentage={percentage} color={color} />
      <BatteryText isOver={isOver} remaining={remaining} goal={goal} />
    </div>
  );
};

export default BatteryInfo;
