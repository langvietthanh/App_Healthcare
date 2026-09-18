import { useNavigate } from 'react-router-dom';
import { Bell, BarChart2, Scale, Droplets, Minus, Plus, Play } from 'lucide-react';
import { useDailyLog, useWorkout } from '../../../providers/user';
import defaultAvatar from '../../../assets/images/defaultAvarta.png';

const DashboardHeader = ({ user }) => (
  // GIAO DIỆN DASHBOARD HEADER
  <div className="bg-[#c8f31d] rounded-b-[40px] px-6 pt-12 pb-10 text-black relative z-10 shadow-lg">
    <div className="flex justify-between items-center mb-8">
      <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
        <img
          src={user?.imgURL ? (user.imgURL.startsWith('/') ? `http://localhost:3000${user.imgURL}` : user.imgURL) : defaultAvatar}
          alt="Avatar"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = defaultAvatar; }}
        />
      </div>
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 bg-black/10 rounded-xl flex items-center justify-center hover:bg-black/20 transition-colors">
          <Bell size={22} className="text-black" />
        </button>
      </div>
    </div>
    <div>
      <p className="text-xl font-extrabold mb-1 text-white">Xin chào, Buổi sáng tốt lành</p>
      <h1 className="text-3xl font-extrabold tracking-tight text-white">{user?.username || "Đang tải..."}</h1>
    </div>
  </div>
);

const WorkoutBanner = () => {
  const { state, setWorkoutView } = useWorkout();
  const count = state.scheduledExercises?.length || 0;
  const navigate = useNavigate();
  const handleClick = () => {
    setWorkoutView('list');
    navigate('/workouts');
  };

  return (
    // GIAO DIỆN WORKOUT BANNER
    <div
      onClick={handleClick}
      className="bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700 rounded-3xl p-5 flex items-center gap-4 relative shadow-xl overflow-hidden cursor-pointer hover:border-[#c8f31d]/50 transition-colors group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[#c8f31d]/10 to-transparent pointer-events-none group-hover:from-[#c8f31d]/20 transition-colors" />
      <div className="w-14 h-14 bg-[#c8f31d] rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(200,243,29,0.4)]">
        <Play size={26} className="text-black fill-black" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-zinc-400 font-medium mb-1">Buổi tập hôm nay</p>
        <h3 className="font-black text-white text-base">
          {count > 0 ? `Bạn có ${count} bài tập` : 'Chưa có lịch tập'}
        </h3>
      </div>
    </div>
  );
};

const MetricsWidgets = ({
  user, setPage, water, waterGoal, waterPct, updateWaterIntake
}) => (
  // GIAO DIỆN METRICS WIDGETS
  <>
    <div className="grid grid-cols-3 gap-4">
      <button
        onClick={() => setPage('weight')}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center gap-2 hover:border-[#c8f31d]/50 hover:bg-zinc-800 transition-all shadow-lg group text-left"
      >
        <div className="w-11 h-11 bg-[#c8f31d]/10 rounded-2xl flex items-center justify-center group-hover:bg-[#c8f31d]/20 transition-colors">
          <Scale size={22} className="text-[#c8f31d]" />
        </div>
        <p className="text-xl font-black text-white">{user?.physicalDetail?.weight || '--'}</p>
        <p className="text-[10px] text-zinc-500 font-semibold">
          {user?.goals?.weightGoal ? `/ ${user.goals.weightGoal} kg` : 'kg'}
        </p>
      </button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center gap-2 shadow-lg">
        <div className="w-11 h-11 bg-blue-500/10 rounded-2xl flex items-center justify-center">
          <Droplets size={22} className="text-blue-400" />
        </div>
        <p className="text-xl font-black text-white">{(water / 1000).toFixed(1)}</p>
        <p className="text-[10px] text-zinc-500 font-semibold">/ {waterGoal / 1000}L</p>
        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
          <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${waterPct}%` }} />
        </div>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => updateWaterIntake(Math.max(0, water - 250))}
            className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center text-white hover:bg-zinc-600 transition-colors"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => updateWaterIntake(water + 250)}
            className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-400 transition-colors"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      <button
        onClick={() => setPage('stats')}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col items-center justify-center gap-2 hover:border-purple-500/50 hover:bg-zinc-800 transition-all shadow-lg group text-center"
      >
        <div className="w-11 h-11 bg-purple-500/10 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
          <BarChart2 size={22} className="text-purple-400" />
        </div>
        <p className="text-[12px] font-semibold text-white mt-1">Chi tiết</p>
      </button>
    </div>

    <div className="grid grid-cols-3 gap-4 -mt-3">
      {['Cân nặng', 'Lượng nước', 'Thống kê'].map((label, i) => (
        // GIAO DIỆN METRICS WIDGETS
        <p key={i} className="text-center text-[11px] text-zinc-500 font-semibold">
          {label}
        </p>
      ))}
    </div>
  </>
);

const DashboardHome = ({ setPage }) => {
  const { state, updateWaterIntake } = useDailyLog();
  const { user, dailyLog } = state;
  const water = dailyLog?.waterIntake || 0;
  // Tính toán lượng nước mục tiêu: 35ml cho mỗi kg cân nặng
  const waterGoal = user?.physicalDetail?.weight
    ? Math.round(user.physicalDetail.weight * 35)
    : 2500;
  const waterPct = Math.min(((water <= waterGoal ? water : waterGoal) / waterGoal) * 100, 100);

  return (
    // GIAO DIỆN DASHBOARD HOME
    <div className="flex flex-col pb-6 text-white bg-[#111]">
      <DashboardHeader user={user} />

      <div className="px-6 -mt-4 relative z-20 space-y-5 pt-8">
        <WorkoutBanner />

        <MetricsWidgets
          user={user}
          setPage={setPage}
          water={water}
          waterGoal={waterGoal}
          waterPct={waterPct}
          updateWaterIntake={updateWaterIntake}
        />
      </div>
    </div>
  );
};

export default DashboardHome;
