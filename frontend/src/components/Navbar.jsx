import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Layers, 
  User, 
  LogOut, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Sliders, 
  BarChart3, 
  LogIn, 
  UserPlus, 
  Activity 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
    ${isActive(path) 
      ? 'bg-indigo-600/35 text-indigo-400 border border-indigo-500/30' 
      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'}
  `;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/70 px-6 py-4 flex items-center justify-between">
      {/* Brand logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-xl text-white shadow-lg group-hover:scale-105 transition-all">
          <Layers size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight text-gradient">
          Q-Flow
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {user.role === 'ROLE_ADMIN' ? (
              <>
                <Link to="/admin" className={navLinkClass('/admin')}>
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <Link to="/admin/counters" className={navLinkClass('/admin/counters')}>
                  <Sliders size={16} />
                  <span>Counters</span>
                </Link>
                <Link to="/admin/reports" className={navLinkClass('/admin/reports')}>
                  <BarChart3 size={16} />
                  <span>Reports</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/join-queue" className={navLinkClass('/join-queue')}>
                  <PlusCircle size={16} />
                  <span>Join Queue</span>
                </Link>
                <Link to="/my-queue" className={navLinkClass('/my-queue')}>
                  <Activity size={16} />
                  <span>Active Ticket</span>
                </Link>
                <Link to="/history" className={navLinkClass('/history')}>
                  <History size={16} />
                  <span>History</span>
                </Link>
              </>
            )}

            <div className="h-4 w-px bg-slate-800" />

            <Link to="/profile" className={navLinkClass('/profile')}>
              <User size={16} />
              <span>{user.name}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={navLinkClass('/login')}>
              <LogIn size={16} />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <UserPlus size={16} />
              <span>Register</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
