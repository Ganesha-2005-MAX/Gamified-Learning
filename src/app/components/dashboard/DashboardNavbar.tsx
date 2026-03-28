import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router';
import { useGame } from '../../context/GameContext';
import { Bell, Menu, User, Settings, LogOut, ChevronDown, Zap, GraduationCap, LayoutDashboard, BookOpen, MessageSquare, Trophy, FileText } from 'lucide-react';

interface NavbarProps {
  onMenuClick?: () => void;
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/subjects', icon: BookOpen, label: 'Subjects' },
  { path: '/chat', icon: MessageSquare, label: 'AI Tutor' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/exam', icon: FileText, label: 'Mock Exam' },
];

export const DashboardNavbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { state, logout } = useGame();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isImmersive = location.pathname.includes('/quiz/') || 
                   location.pathname.startsWith('/exam') ||
                   (location.pathname.startsWith('/subjects/') && location.pathname !== '/subjects');

  if (isImmersive) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-indigo-100/50 bg-white/70 px-4 backdrop-blur-xl md:px-8">
      {/* Brand & Desktop Nav */}
      <div className="flex items-center gap-8">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-transform group-hover:scale-105">
            <GraduationCap size={22} color="white" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-slate-900 text-lg font-black tracking-tight leading-none">EduQuest</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AI Platform</span>
          </div>
        </div>

        {/* Horizontal Navigation (Desktop Only) - Hidden in Immersive Mode */}
        {!isImmersive && (
          <div className="hidden lg:flex items-center gap-1.5 ml-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                    isActive 
                      ? 'text-indigo-600 bg-indigo-50/50' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon size={16} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                    {item.label}
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="navbarActive"
                      className="absolute bottom-[-10px] left-4 right-4 h-1 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Sign Out Button (Prominent) */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl text-rose-500 font-bold text-sm transition-all hover:bg-rose-50 hover:shadow-lg hover:shadow-rose-500/10 border border-transparent hover:border-rose-100"
        >
          <LogOut size={16} />
          <span className="hidden xl:inline">Sign Out</span>
        </motion.button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Bell size={22} />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
          </motion.button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl"
              >
                <div className="p-3">
                  <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                </div>
                <div className="space-y-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-3 rounded-xl p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                        <Zap size={18} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs font-bold text-slate-900">Daily Goal Reached!</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed">You earned 50 bonus XP for completing your daily target.</p>
                        <span className="text-[10px] font-medium text-slate-400 mt-1">2h ago</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 border-t border-slate-50 p-2 text-center">
                  <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-2 pr-4 transition-colors hover:border-indigo-100 hover:bg-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-sm shadow-lg shadow-indigo-600/20 text-white font-bold">
              {state.user?.avatar || '🎓'}
            </div>
            <div className="hidden flex-col items-start px-1.5 md:flex">
              <span className="text-sm font-bold text-slate-900 leading-tight">{state.user?.name?.split(' ')[0]}</span>
              <span className="text-xs font-medium text-slate-400">Class {state.user?.class}</span>
            </div>
            <ChevronDown size={15} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-0" onClick={() => setShowProfileMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white/80 p-1.5 shadow-2xl backdrop-blur-xl"
                >
                  <div className="p-3 border-b border-slate-100 mb-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account</p>
                  </div>
                  <button 
                    onClick={() => { navigate('/profile'); setShowProfileMenu(false); }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <User size={16} /> My Profile
                  </button>
                  <button 
                    onClick={() => { setShowProfileMenu(false); }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <Settings size={16} /> Account Settings
                  </button>
                  <hr className="my-1.5 border-slate-100" />
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold text-rose-500 transition-all hover:bg-rose-50"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
