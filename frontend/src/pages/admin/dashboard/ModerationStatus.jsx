import { STATUS_CONFIG } from "../../../constants";

const ModerationStatus = ({ statusBreakdown }) => {
  const data = statusBreakdown?.foods || {};

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="font-bold text-white text-base mb-6">Trạng thái kiểm duyệt món ăn</h2>
      <div className="space-y-2">
        {Object.entries(data).map(([status, count]) => {
          const config = STATUS_CONFIG[status] || { label: status, color: '#71717a' };
          if (status === 'none' && count === 0) return null;
          return (
            <div key={status} className="flex items-center justify-between py-2.5 border-b border-zinc-800/50 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                <span className="text-sm text-zinc-300">{config.label}</span>
              </div>
              <span className="font-black text-white">{count.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModerationStatus;
