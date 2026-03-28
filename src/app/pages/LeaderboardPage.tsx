import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { getLevelFromXP, LEVEL_NAMES } from '../data/subjects';
import { Trophy, Flame, Zap, TrendingUp, Star, Crown, Target, Users } from 'lucide-react';

interface LeaderEntry {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  accuracy: number;
  level: number;
  class: string;
  targetExam: string;
  isUser?: boolean;
}

const generateMockLeaders = (userXP: number, userName: string, userAvatar: string, userStreak: number): LeaderEntry[] => {
  const mockData = [
    { name: 'Arjun Sharma', avatar: '🦁', xp: 12450, streak: 28, accuracy: 94, class: '12', targetExam: 'NEET' },
    { name: 'Priya Nair', avatar: '👩‍🎓', xp: 11200, streak: 21, accuracy: 91, class: '12', targetExam: 'NEET' },
    { name: 'Rohan Patel', avatar: '🧑‍💻', xp: 9800, streak: 18, accuracy: 88, class: '12', targetExam: 'JEE' },
    { name: 'Sneha Iyer', avatar: '🦊', xp: 8900, streak: 15, accuracy: 86, class: '12', targetExam: 'Boards' },
    { name: 'Karan Mehta', avatar: '🧙', xp: 7600, streak: 12, accuracy: 83, class: '10', targetExam: 'Boards' },
    { name: 'Ananya Verma', avatar: '👩‍💻', xp: 6900, streak: 10, accuracy: 80, class: '12', targetExam: 'CUET' },
    { name: 'Dev Krishnan', avatar: '🐉', xp: 5400, streak: 9, accuracy: 77, class: '10', targetExam: 'Boards' },
    { name: 'Ishaan Gupta', avatar: '⭐', xp: 4200, streak: 7, accuracy: 74, class: '12', targetExam: 'JEE' },
    { name: 'Riya Singh', avatar: '🦹', xp: 3100, streak: 5, accuracy: 71, class: '10', targetExam: 'Boards' },
    { name: 'Aarav Joshi', avatar: '🐺', xp: 2200, streak: 3, accuracy: 68, class: '12', targetExam: 'NEET' },
  ];

  const entries: LeaderEntry[] = mockData.map((d, i) => ({
    ...d,
    rank: i + 1,
    level: getLevelFromXP(d.xp),
  }));

  if (userName) {
    const userEntry: LeaderEntry = {
      name: userName,
      avatar: userAvatar,
      xp: userXP,
      streak: userStreak,
      accuracy: 75,
      class: '12',
      targetExam: 'NEET',
      level: getLevelFromXP(userXP),
      rank: 0,
      isUser: true,
    };
    entries.push(userEntry);
  }

  entries.sort((a, b) => b.xp - a.xp);
  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
};

export const LeaderboardPage: React.FC = () => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'class'>('global');

  const leaders = useMemo(() => generateMockLeaders(
    state.xp,
    state.user?.name || '',
    state.user?.avatar || '🎓',
    state.streak,
  ), [state.xp, state.user, state.streak]);

  const userRank = leaders.find(l => l.isUser)?.rank || 0;
  const userEntry = leaders.find(l => l.isUser);

  const podiumColors = [
    { main: '#94A3B8', bg: 'rgba(148,163,184,0.1)', border: '#94A3B8', icon: '🥈' }, // 2nd
    { main: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: '#F59E0B', icon: '🥇' }, // 1st
    { main: '#CD7F32', bg: 'rgba(205,127,50,0.1)', border: '#CD7F32', icon: '🥉' }, // 3rd
  ];

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Your Rank', value: userRank ? `#${userRank}` : '—', color: '#4F46E5', bg: 'rgba(79,70,229,0.08)', icon: Crown },
            { label: 'Your XP', value: state.xp.toLocaleString(), color: '#7C3AED', bg: 'rgba(124,58,237,0.08)', icon: Zap },
            { label: 'Your Streak', value: `${state.streak}d`, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', icon: Flame },
          ].map(s => (
            <div key={s.label} className="edu-stat-card text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: s.bg }}>
                <s.icon size={18} color={s.color} />
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Your Rank Card */}
        {userEntry && (
          <motion.div
            className="edu-card p-4 mb-6"
            style={{ border: '1.5px solid rgba(79,70,229,0.2)', background: 'linear-gradient(135deg, rgba(79,70,229,0.04), rgba(124,58,237,0.04))' }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={12} /> Your Ranking
            </div>
            <div className="flex items-center gap-4">
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4F46E5', minWidth: 52 }}>
                #{userRank}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                {userEntry.avatar}
              </div>
              <div className="flex-1">
                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>{userEntry.name} (You)</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Lv.{userEntry.level} {LEVEL_NAMES[Math.min(userEntry.level - 1, LEVEL_NAMES.length - 1)]}
                </div>
              </div>
              <div className="text-right">
                <div style={{ color: '#4F46E5', fontWeight: 700, fontSize: '0.95rem' }}>{userEntry.xp.toLocaleString()} XP</div>
                <div className="flex items-center gap-1 justify-end" style={{ fontSize: '0.75rem', color: '#F59E0B' }}>
                  <Flame size={11} /> {userEntry.streak} day streak
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-1.5 rounded-xl p-1.5 mb-8 bg-slate-200/50 backdrop-blur-sm">
          {([
            { id: 'global', label: '🌍 Global', desc: 'All Students' },
            { id: 'weekly', label: '📅 Weekly', desc: 'This Week' },
            { id: 'class', label: '🎓 Class 12', desc: 'Your Class' },
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
                  layoutId="activeLeaderboardTab"
                  className="absolute inset-0 bg-white shadow-md shadow-indigo-500/5 rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Podium Top 3 */}
        <motion.div
          className="edu-card p-6 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem', marginBottom: 20, textAlign: 'center' }}>
            🏆 Top Performers
          </div>
          <div className="flex items-end justify-center gap-4">
            {[leaders[1], leaders[0], leaders[2]].map((leader, i) => {
              if (!leader) return null;
              const pc = podiumColors[i];
              const heights = [80, 110, 65];
              return (
                <motion.div
                  key={leader.rank}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-2"
                    style={{ background: pc.bg, border: `2px solid ${pc.border}40` }}>
                    {leader.avatar}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 600, marginBottom: 4, maxWidth: 72, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {leader.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{pc.icon}</div>
                  <div
                    className="rounded-t-2xl flex flex-col items-center justify-center w-20"
                    style={{ height: heights[i], background: pc.bg, border: `1.5px solid ${pc.border}30`, borderBottom: 'none' }}>
                    <div style={{ fontWeight: 800, color: pc.main, fontSize: '0.85rem' }}>#{leader.rank}</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{(leader.xp / 1000).toFixed(1)}k XP</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Full Rankings */}
        <div className="edu-card overflow-hidden">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.9rem' }}>Full Rankings</span>
            <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Users size={13} /> {leaders.length} students
            </span>
          </div>
          <div>
            {leaders.map((leader, i) => {
              const isCurrentUser = leader.isUser;
              return (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 transition-all"
                  style={{
                    background: isCurrentUser ? 'rgba(79,70,229,0.04)' : 'transparent',
                    borderBottom: i < leaders.length - 1 ? '1px solid #F1F5F9' : 'none',
                    borderLeft: isCurrentUser ? '3px solid #4F46E5' : '3px solid transparent',
                  }}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.5) }}>

                  {/* Rank */}
                  <div style={{ minWidth: 36, textAlign: 'center' }}>
                    {leader.rank === 1 ? <span style={{ fontSize: '1.2rem' }}>🥇</span> :
                     leader.rank === 2 ? <span style={{ fontSize: '1.2rem' }}>🥈</span> :
                     leader.rank === 3 ? <span style={{ fontSize: '1.2rem' }}>🥉</span> :
                     <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#94A3B8' }}>#{leader.rank}</span>}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: isCurrentUser ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#F1F5F9' }}>
                    {leader.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '0.88rem', fontWeight: isCurrentUser ? 700 : 500, color: '#1E293B' }} className="truncate">
                        {leader.name}{isCurrentUser && ' (You)'}
                      </span>
                      {isCurrentUser && <Crown size={12} color="#4F46E5" />}
                    </div>
                    <div className="flex items-center gap-3" style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 1 }}>
                      <span>Lv.{leader.level}</span>
                      <span style={{ color: '#F59E0B' }}>🔥 {leader.streak}</span>
                      <span style={{ color: '#10B981' }}>🎯 {leader.accuracy}%</span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="text-right flex-shrink-0">
                    <div style={{ color: '#4F46E5', fontWeight: 700, fontSize: '0.875rem' }}>
                      {leader.xp.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>XP</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Weekly Challenge */}
        <motion.div
          className="edu-card p-5 mt-5"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(239,68,68,0.05))', border: '1px solid rgba(245,158,11,0.2)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
              <TrendingUp size={18} color="#F59E0B" />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>Weekly Challenge Active!</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Complete 50 questions this week to earn +500 Bonus XP</div>
            </div>
          </div>
          <div className="edu-progress-bar" style={{ height: 8, background: 'rgba(245,158,11,0.15)' }}>
            <div className="h-full rounded-full" style={{ width: '36%', background: 'linear-gradient(90deg, #F59E0B, #EF4444)' }} />
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 8 }}>18 / 50 questions completed this week</div>
        </motion.div>
      </div>
  );
};
