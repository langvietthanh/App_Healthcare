const GOAL_MAP = {
  lose_weight: { label: 'Giảm cân', color: '#f97316' },
  balance: { label: 'Cân bằng', color: '#c8f31d' },
  gain_muscle: { label: 'Tăng cơ', color: '#22c55e' },
};

const UserGoalsDistribution = ({ goalDistribution }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="font-bold text-white text-base mb-6">Phân bổ mục tiêu người dùng</h2>
      <div className="space-y-5">
        {Object.entries(GOAL_MAP).map(([goalKey, mapped], i) => {
          // Tìm data trả về từ API, nếu không có thì mặc định percent = 0
          const apiData = goalDistribution?.find(g => g.goal === goalKey);
          const percent = apiData ? apiData.percent : 0;
          
          return (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-300 font-medium">{mapped.label}</span>
                <span className="font-black" style={{ color: mapped.color }}>
                  {percent}%
                </span>
              </div>
              <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${percent}%`, backgroundColor: mapped.color }}
                />
              </div>
            </div>
          );
        })}
        {/* Render những goal khác (ví dụ: null) nếu Backend có trả về nhưng không nằm trong GOAL_MAP */}
        {goalDistribution?.filter(g => !GOAL_MAP[g.goal]).map((g, i) => (
          <div key={`other-${i}`}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-300 font-medium">{g.goal || 'Chưa đặt'}</span>
              <span className="font-black text-zinc-400">{g.percent}%</span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-zinc-400 transition-all duration-700" style={{ width: `${g.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserGoalsDistribution;

