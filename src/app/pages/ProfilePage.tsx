import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { subjects, BADGES, LEVEL_NAMES, getLevelFromXP, getXPForNextLevel, LEVEL_THRESHOLDS } from '../data/subjects';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Settings, LogOut, Trophy, Target, Zap, Flame, BookOpen, CheckCircle, Lock, Star, TrendingUp, Award } from 'lucide-react';

const avatarOptions = ['🧑‍🎓', '👩‍🎓', '🧑‍💻', '👩‍💻', '🦸', '🦹', '🧙', '🦊', '🐺', '🦁', '🐉', '⚡', '🎯', '🔥', '💎', '🌟'];

export const ProfilePage: React.FC = () => {
  const { state, logout, level, levelName, xpForNextLevel, xpProgressPercent, getSubjectAccuracy } = useGame();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'history'>('overview');
  const [showSettings, setShowSettings] = useState(false);

  const user = state.user;
  if (!user) return null;

  const overallAccuracy = state.totalAttempts > 0
    ? Math.round((state.correctAttempts / state.totalAttempts) * 100)
    : 0;

  const completedChapters = state.chapterProgress.filter(p => p.completed).length;
  const totalChapters = subjects.reduce((sum, s) => sum + s.chapters.length, 0);

  const subjectBars = subjects.map(s => ({
    name: s.name.slice(0, 4),
    accuracy: getSubjectAccuracy(s.id),
    color: s.color,
  }));

  const joinDate = new Date(user.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Predicted score based on accuracy
  const predictedScore = Math.min(100, Math.round(overallAccuracy * 0.9 + (state.streak / 30) * 10));

  return (
    <div className="flex flex-col gap-6">
        <motion.div
          className="edu-card p-6 mb-2"
          style={{ background: 'linear-gradient(135deg, #4338CA, #6D28D9)', border: 'none', position: 'relative', overflow: 'hidden' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}>
          <div style={{ fontSize: '8rem', position: 'absolute', right: -20, top: -20, opacity: 0.06, pointerEvents: 'none' }}>{user.avatar}</div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 relative">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl relative"
                style={{ background: 'rgba(255,255,255,0.2)' }}
                whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }}>
                {user.avatar}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ background: '#F59E0B', color: '#fff' }}>
                  {level}
                </div>
              </motion.div>
              <div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: 2 }}>{user.name}</h1>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{user.email}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="edu-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.72rem' }}>Class {user.class}</span>
                  <span className="edu-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.72rem' }}>{user.targetExam}</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Joined {joinDate}</span>
                </div>
              </div>
            </div>

            <div className="md:ml-auto">
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 16px', textAlign: 'right' }}>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Level {level} — {levelName}</div>
                <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{state.xp.toLocaleString()} XP</div>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Progress to Level {level + 1}</span>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{Math.round(xpProgressPercent)}%</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
              <motion.div
                style={{ background: '#fff', height: '100%', borderRadius: 999 }}
                initial={{ width: 0 }}
                animate={{ width: `${xpProgressPercent}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{Math.round(xpForNextLevel - state.xp)} XP to next level</div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total XP', value: state.xp.toLocaleString(), icon: '⚡', color: '#4F46E5', bg: 'rgba(79,70,229,0.08)' },
            { label: 'Streak', value: `${state.streak} days`, icon: '🔥', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
            { label: 'Coins', value: state.coins.toLocaleString(), icon: '🪙', color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
            { label: 'Accuracy', value: `${overallAccuracy}%`, icon: '🎯', color: '#7C3AED', bg: 'rgba(124,58,237,0.08)' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="edu-stat-card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{stat.icon}</div>
              <div style={{ color: stat.color, fontSize: '1.3rem', fontWeight: 800 }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 2 }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 rounded-xl p-1.5 mb-8 bg-slate-200/50 backdrop-blur-sm">
          {([
            { id: 'overview', label: '📊 Overview' },
            { id: 'badges', label: '🏅 Badges' },
            { id: 'history', label: '📖 History' },
          ] as const).map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 py-3 rounded-xl text-sm transition-colors duration-200"
              style={{
                color: activeTab === tab.id ? '#1E293B' : '#64748B',
                fontWeight: activeTab === tab.id ? 800 : 600,
                border: 'none',
                cursor: 'pointer',
                background: 'transparent'
              }}
              whileTap={{ scale: 0.96 }}>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeProfileTab"
                  className="absolute inset-0 bg-white shadow-md shadow-indigo-500/5 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ======= OVERVIEW TAB ======= */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Subject Accuracy Chart */}
                <div className="edu-card p-5">
                  <h3 style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={14} color="#4F46E5" /> Subject Accuracy
                  </h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={subjectBars} barSize={28}>
                      <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, color: '#1E293B', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                        formatter={(val) => [`${val}%`, 'Accuracy']}
                      />
                      <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                        {subjectBars.map((entry, i) => (
                          <Cell key={i} fill={['#4F46E5', '#10B981', '#EF4444', '#F59E0B'][i % 4]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Predicted Score */}
                <div className="edu-card p-5">
                  <h3 style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Target size={14} color="#7C3AED" /> Predicted Score
                  </h3>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#4F46E5" strokeWidth="10"
                          strokeDasharray={`${predictedScore * 2.51} 251`}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dasharray 1.5s ease' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4F46E5' }}>{predictedScore}%</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>predicted</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', textAlign: 'center' }}>
                    Based on your accuracy and study habits
                  </div>
                </div>

                {/* Study Stats */}
                <div className="edu-card p-5">
                  <h3 style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BookOpen size={14} color="#10B981" /> Study Stats
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Questions Attempted', value: state.totalAttempts, color: '#4F46E5' },
                      { label: 'Correct Answers', value: state.correctAttempts, color: '#10B981' },
                      { label: 'Chapters Completed', value: `${completedChapters} / ${totalChapters}`, color: '#F59E0B' },
                      { label: 'Badges Earned', value: state.badges.length, color: '#7C3AED' },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center">
                        <span style={{ fontSize: '0.82rem', color: '#64748B' }}>{item.label}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Level Journey */}
                <div className="edu-card p-5">
                  <h3 style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Zap size={14} color="#F59E0B" /> Level Journey
                  </h3>
                  <div className="space-y-2">
                    {LEVEL_NAMES.slice(0, 8).map((name, i) => {
                      const reached = level > i + 1;
                      const current = level === i + 1;
                      return (
                        <div key={name} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                            style={{
                              background: reached ? 'rgba(79,70,229,0.1)' : current ? 'rgba(245,158,11,0.1)' : '#F1F5F9',
                              border: reached ? '1px solid rgba(79,70,229,0.3)' : current ? '1px solid rgba(245,158,11,0.3)' : '1px solid #E2E8F0',
                            }}>
                            {reached ? '✓' : current ? '►' : <span style={{ color: '#CBD5E1', fontSize: '0.65rem' }}>{i + 1}</span>}
                          </div>
                          <span style={{ fontSize: '0.82rem', color: reached ? '#4F46E5' : current ? '#D97706' : '#CBD5E1' }}>
                            {name}
                          </span>
                          {current && <span className="edu-badge" style={{ background: 'rgba(245,158,11,0.1)', color: '#D97706', fontSize: '0.68rem', padding: '2px 8px' }}>Current</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======= BADGES TAB ======= */}
          {activeTab === 'badges' && (
            <motion.div key="badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="edu-card p-5 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Award size={14} color="#F59E0B" /> Achievements
                  </h3>
                  <span className="edu-badge edu-badge-blue">{state.badges.length} / {BADGES.length} earned</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BADGES.map((badge, i) => {
                    const earned = state.badges.includes(badge.id);
                    return (
                      <motion.div
                        key={badge.id}
                        className={`p-4 rounded-xl ${earned ? 'achievement-unlock' : ''}`}
                        style={{
                          background: earned ? `${badge.color}0D` : '#F8FAFF',
                          border: earned ? `1px solid ${badge.color}25` : '1px solid #E2E8F0',
                          opacity: earned ? 1 : 0.5,
                        }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: earned ? 1 : 0.5, scale: 1 }}
                        transition={{ delay: i * 0.04 }}>
                        <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{earned ? badge.icon : '🔒'}</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{badge.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', lineHeight: 1.4 }}>{badge.description}</div>
                        {earned && (
                          <div className="mt-2 flex items-center gap-1">
                            <CheckCircle size={11} color={badge.color} />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: badge.color }}>Unlocked!</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ======= HISTORY TAB ======= */}
          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="edu-card p-5">
                <h3 style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={14} color="#4F46E5" /> Chapter History
                </h3>
                {state.chapterProgress.length === 0 ? (
                  <div className="text-center py-10">
                    <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>📚</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: 16 }}>No quiz history yet. Start learning!</div>
                    <motion.button
                      onClick={() => navigate('/subjects')}
                      className="edu-btn-primary"
                      style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                      whileHover={{ scale: 1.05 }}>
                      Start Now
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.chapterProgress
                      .sort((a, b) => new Date(b.lastAttempted || 0).getTime() - new Date(a.lastAttempted || 0).getTime())
                      .map((prog, i) => {
                        const subject = subjects.find(s => s.id === prog.subjectId);
                        const chapter = subject?.chapters.find(c => c.id === prog.chapterId);
                        if (!subject || !chapter) return null;
                        const acc = prog.attempts > 0 ? Math.round((prog.correct / prog.attempts) * 100) : 0;
                        const accColor = acc >= 70 ? '#10B981' : acc >= 40 ? '#F59E0B' : '#EF4444';
                        return (
                          <motion.div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ background: '#F8FAFF', border: '1px solid #E2E8F0' }}
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: '#EEF2FF' }}>
                              {chapter.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1E293B' }} className="truncate">{chapter.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 2 }}>{subject.name} • {prog.lastAttempted}</div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div style={{ color: accColor, fontWeight: 700, fontSize: '0.9rem' }}>{acc}%</div>
                              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{prog.correct}/{prog.attempts}</div>
                            </div>
                            {prog.completed && (
                              <CheckCircle size={15} color="#10B981" style={{ flexShrink: 0 }} />
                            )}
                          </motion.div>
                        );
                      })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};