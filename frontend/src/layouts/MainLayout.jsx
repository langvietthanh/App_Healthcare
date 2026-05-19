import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Utensils, Dumbbell, User, BookOpen } from 'lucide-react';
import { useDailyLog } from '../context/DailyLogContext';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, fetchUserTarget } = useDailyLog();
  const { user } = state;

  useEffect(() => {
    // Tải thông tin User toàn cục ngay khi Layout chứa thanh Sidebar được tải lên
    if (!user) {
      fetchUserTarget();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/diary', label: 'Diary', icon: BookOpen },
    { path: '/meals', label: 'Meal Plans', icon: Utensils },
    { path: '/workouts', label: 'Exercise', icon: Dumbbell },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#111] text-white font-sans overflow-hidden">
      {/* Sidebar bên trái */}
      <aside className="w-64 bg-[#1a1a1a] border-r border-zinc-800 flex flex-col z-20 shadow-2xl">
        <div className="p-8 pb-4">
          <h1 className="text-3xl font-extrabold text-[#c8f31d] tracking-tight">FitTrack Pro</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={isActive ? { color: 'black', backgroundColor: 'rgb(200 243 29 / 82%)' } : {}}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl font-bold transition-all ${isActive
                  ? "shadow-[0_0_15px_rgba(200,243,29,0.3)]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer của Sidebar */}
        <div className="p-6 border-t border-zinc-800 bg-[#141414]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#c8f31d] overflow-hidden p-0.5">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={user?.imgURL || "/Avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user?.username || "Đang tải..."}</p>
              <button onClick={handleLogout} className="text-xs text-zinc-500 hover:text-[#c8f31d] transition-colors">Đăng xuất</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content bên phải */}
      <main className="flex-1 overflow-y-auto scrollbar-hide bg-[#111] relative">
        <div className="max-w-5xl mx-auto min-h-full bg-[#111] shadow-2xl relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
