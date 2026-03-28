import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { getLevelFromXP, LEVEL_NAMES } from '../data/subjects';
import {
  LayoutDashboard, BookOpen, MessageSquare, Trophy, User, LogOut,
  Menu, X, Zap, Flame, GraduationCap, FileText, ChevronRight, HelpCircle, Star, Award, Settings
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/subjects', icon: BookOpen, label: 'My Subjects' },
  { path: '/chat', icon: MessageSquare, label: 'AI Tutor' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/exam', icon: FileText, label: 'Mock Exam' },
  { path: '/profile', icon: User, label: 'My Profile' },
];

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { state, logout, level, levelName, xpProgressPercent } = useGame();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-300">
      {/* Brand Logo */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNav('/dashboard')}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-transform group-hover:scale-110">
            <GraduationCap size={22} color="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-xl font-black tracking-tight leading-none">EduQuest</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1.5">AI Platform</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto edu-scrollbar">
        <div className="px-3 mb-4 flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500">
          <span>Main Ecosystem</span>
        </div>
        
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              onClick={() => handleNav(item.path)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-[15px] font-bold transition-all duration-200 ${
                isActive 
                  ? 'bg-white/10 text-white shadow-xl shadow-black/20 backdrop-blur-md' 
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 h-6 w-1 rounded-r-full bg-indigo-500" 
                />
              )}
              <item.icon size={18} className={`${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && (
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              )}
            </motion.button>
          );
        })}
      </nav>


      <div className="px-4 pt-4 pb-8 border-t border-white/5 bg-black/20">
        <button 
           onClick={() => navigate('/profile')}
           className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-white/5"
        >
           <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center text-sm ring-1 ring-white/10 transition-transform group-hover:scale-105">
              {state.user?.avatar || '🎓'}
           </div>
           <div className="flex flex-col items-start flex-1 overflow-hidden">
              <span className="text-sm font-bold text-white truncate w-full">{state.user?.name}</span>
              <span className="text-xs font-semibold text-slate-500">Student</span>
           </div>
           <Settings size={14} className="text-slate-500 group-hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 transition-all duration-300">
        <SidebarContent />
      </aside>

      {/* Mobile Nav TopBar (Placeholder for Layout.tsx use) */}
      <div className="md:hidden flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
         {/* This is handled by MobileTopBar if used externally */}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="absolute top-0 left-0 bottom-0 w-72 flex flex-col shadow-2xl"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <SidebarContent />
              {/* Close Button Mobile */}
              <button 
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-[-50px] flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-xl"
              >
                <X size={20} />
              </button>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const MobileTopBar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { state } = useGame();
  return (
    <div className="md:hidden flex h-20 items-center justify-between px-4 bg-white border-b border-slate-100 sticky top-0 z-40 transition-all">
      <button onClick={onMenuClick} className="p-2 rounded-xl bg-slate-50 text-indigo-600 transition-colors hover:bg-indigo-50">
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-600 shadow-lg shadow-indigo-600/20">
          <GraduationCap size={16} color="white" />
        </div>
        <span className="text-slate-900 text-base font-black tracking-tight">EduQuest</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 shadow-sm border border-amber-100">
        <Flame size={14} className="text-amber-500" />
        <span className="text-amber-600 text-xs font-black">{state.streak}</span>
      </div>
    </div>
  );
};
