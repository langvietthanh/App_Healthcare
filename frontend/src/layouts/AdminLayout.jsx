import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Utensils, Dumbbell, BarChart2, LogOut, ShieldCheck
} from 'lucide-react';
import { AdminDashBoardProvider, AdminUsersProvider, AdminFoodsProvider } from '../context/admin/index';

const navItems = [
  { path: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Người dùng', icon: Users },
  { path: '/admin/foods', label: 'Món ăn', icon: Utensils },
  { path: '/admin/exercises', label: 'Bài tập', icon: Dumbbell },
  { path: '/admin/reports', label: 'Báo cáo', icon: BarChart2 },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    < AdminDashBoardProvider>
      <AdminUsersProvider>
        <AdminFoodsProvider>
          <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#111] border-r border-zinc-800 flex flex-col z-20 shadow-2xl shrink-0">
              {/* Logo */}
              <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 bg-[#c8f31d] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(200,243,29,0.3)]">
                    <ShieldCheck size={20} className="text-black" strokeWidth={2.5} />
                  </div>
                  <h1 className="text-xl font-extrabold text-[#c8f31d] tracking-tight">Admin Panel</h1>
                </div>
                <p className="text-xs text-zinc-500 pl-12">FitTrack Pro</p>
              </div>

              {/* Nav */}
              <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      style={isActive ? { color: 'black', backgroundColor: 'rgb(200 243 29 / 82%)' } : {}}
                      className={`flex items-center gap-4 px-5 py-3.5 rounded-xl font-semibold transition-all ${isActive
                        ? 'shadow-[0_0_15px_rgba(200,243,29,0.2)]'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        }`}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-zinc-800">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-5 py-3 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-semibold text-sm"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto bg-[#0d0d0d]">
              <Outlet />
            </main>
          </div>
        </AdminFoodsProvider>
      </AdminUsersProvider>
    </AdminDashBoardProvider>
  );
};

export default AdminLayout;
