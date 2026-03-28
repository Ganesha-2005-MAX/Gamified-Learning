import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { getLevelFromXP, LEVEL_NAMES } from '../data/subjects';
import {
  LayoutDashboard, BookOpen, MessageSquare, Trophy, User, LogOut, Menu, X, Zap, Coins, Flame
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/subjects', icon: BookOpen, label: 'Subjects' },
  { path: '/chat', icon: MessageSquare, label: 'AI Tutor' },
  { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export const Navbar: React.FC = () => {
  const { state, logout, level, levelName, xpProgressPercent } = useGame();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:flex items-center justify-between px-6 py-3"
        style={{
          background: 'rgba(8, 8, 16, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/dashboard')}
          whileHover={{ scale: 1.02 }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}>
            🎮
          </div>
          <span className="text-gradient-cyan" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            EduQuest
          </span>
        </motion.div>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
                  isActive ? 'nav-link-active' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <item.icon size={16} />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Stats + Profile */}
        <div className="flex items-center gap-3">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(255, 107, 53, 0.1)', border: '1px solid rgba(255, 107, 53, 0.2)' }}>
            <Flame size={14} style={{ color: '#ff6b35' }} />
            <span style={{ color: '#ff6b35', fontSize: '0.8rem', fontWeight: 600 }}>{state.streak}</span>
          </div>

          {/* Coins */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
            <span style={{ fontSize: '0.8rem' }}>🪙</span>
            <span style={{ color: '#ffd700', fontSize: '0.8rem', fontWeight: 600 }}>{state.coins}</span>
          </div>

          {/* XP Level */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(0, 212, 255, 0.08)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
            <Zap size={14} style={{ color: '#00d4ff' }} />
            <div>
              <div style={{ color: '#00d4ff', fontSize: '0.75rem', fontWeight: 700 }}>
                Lv.{level} {LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)]}
              </div>
              <div className="w-16 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="xp-bar-fill h-full rounded-full" style={{ width: `${xpProgressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Avatar */}
          <motion.button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #00d4ff)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}>
            {state.user?.avatar || '👤'}
          </motion.button>

          {/* Logout */}
          <motion.button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <LogOut size={16} />
          </motion.button>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between px-4 py-3"
        style={{
          background: 'rgba(8, 8, 16, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
        <motion.div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-base"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)' }}>🎮</div>
          <span className="text-gradient-cyan" style={{ fontSize: '1rem', fontWeight: 700 }}>EduQuest</span>
        </motion.div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
            style={{ background: 'rgba(255, 107, 53, 0.1)', border: '1px solid rgba(255, 107, 53, 0.2)' }}>
            <Flame size={12} style={{ color: '#ff6b35' }} />
            <span style={{ color: '#ff6b35', fontSize: '0.75rem', fontWeight: 600 }}>{state.streak}</span>
          </div>
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg text-gray-400 hover:text-white"
            whileTap={{ scale: 0.95 }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />
            <motion.div
              className="absolute top-14 left-0 right-0 p-4 mx-4 rounded-2xl"
              style={{ background: 'rgba(15, 15, 25, 0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}>
              {/* Stats Row */}
              <div className="flex items-center justify-between mb-4 pb-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #00d4ff)' }}>
                    {state.user?.avatar || '👤'}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{state.user?.name}</div>
                    <div style={{ color: '#00d4ff', fontSize: '0.75rem' }}>Lv.{level} {levelName}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}>
                    <span style={{ fontSize: '0.7rem' }}>🪙</span>
                    <span style={{ color: '#ffd700', fontSize: '0.75rem', fontWeight: 600 }}>{state.coins}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                    <Zap size={10} style={{ color: '#00d4ff' }} />
                    <span style={{ color: '#00d4ff', fontSize: '0.75rem', fontWeight: 600 }}>{state.xp} XP</span>
                  </div>
                </div>
              </div>

              {/* Nav Links */}
              <div className="space-y-1">
                {navItems.map(item => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.button
                      key={item.path}
                      onClick={() => { navigate(item.path); setMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                        isActive ? 'nav-link-active' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                      whileTap={{ scale: 0.98 }}>
                      <item.icon size={18} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
                <motion.button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all text-left"
                  whileTap={{ scale: 0.98 }}>
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};