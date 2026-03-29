import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { subjects, BADGES, LEVEL_NAMES, getLevelFromXP } from '../data/subjects';
import {
  Zap, Flame, Trophy, Target, BookOpen, Play, ArrowRight,
  TrendingUp, Clock, Bell, Search, ChevronRight, BarChart2,
  MessageSquare, FileText, Star, Award, Sparkles, CheckCircle2, User, Settings, LogOut, ChevronDown, Command, Loader2
} from 'lucide-react';

// New Dashboard Components
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { ActivityAnalytics } from '../components/dashboard/ActivityAnalytics';
import { SmartInsights } from '../components/dashboard/SmartInsights';
import { RecentActivity } from '../components/dashboard/RecentActivity';

const motivationalQuotes = [
  "Every chapter completed brings you closer to your goal!",
  "Consistency is the key to mastery. Keep going!",
  "Your future self will thank you for studying today.",
  "Small daily improvements lead to outstanding results.",
  "You're building knowledge that will last a lifetime.",
];

export const DashboardPage: React.FC = () => {
  const { state, filteredSubjects, loading, level, levelName, xpForNextLevel, xpProgressPercent, getSubjectAccuracy, getWeakSubjects, checkAndAwardBadges, updateStreak } = useGame();
  const topSubjects = filteredSubjects.slice(0, 4);
  const weakSubjectIds = getWeakSubjects().filter(id => filteredSubjects.some(s => s.id === id));
  const weakSubjects = filteredSubjects.filter(s => weakSubjectIds.includes(s.id));
  const navigate = useNavigate();
  const [quote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  useEffect(() => {
    updateStreak();
    checkAndAwardBadges();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Preparing your dashboard...</p>
      </div>
    );
  }

  const overallAccuracy = state.totalAttempts > 0
    ? Math.round((state.correctAttempts / state.totalAttempts) * 100)
    : 0;

  // const weakSubjects = getWeakSubjects(); // Removed duplicate

  const xpChartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toDateString();
    const found = state.dailyStats.find(s => s.date === dateStr);
    return {
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
      xp: found?.xpEarned || 0,
      questions: found?.questionsAttempted || 0,
    };
  });

  const radarData = filteredSubjects.map(s => ({
    subject: s.name,
    accuracy: getSubjectAccuracy(s.id),
    fullMark: 100,
  }));

  const recentBadges = BADGES.filter(b => state.badges.includes(b.id)).slice(-4);
  const completedChapters = state.chapterProgress.filter(p => p.completed).length;
  const totalChapters = filteredSubjects.reduce((sum, s) => sum + s.chapters.length, 0);

  const lastAttempt = [...state.chapterProgress].sort((a, b) =>
    new Date(b.lastAttempted || 0).getTime() - new Date(a.lastAttempted || 0).getTime()
  )[0];
  const continueSubject = lastAttempt ? filteredSubjects.find(s => s.id === lastAttempt.subjectId) || filteredSubjects[0] : filteredSubjects[0];

  const topStatCards = [
    {
      label: 'Total Learning XP',
      value: state.xp.toLocaleString(),
      sub: `Lv. ${level} ${levelName}`,
      icon: Zap,
      color: '#4F46E5',
      trend: '+12%',
    },
    {
      label: 'Daily Streak',
      value: `${state.streak} Days`,
      sub: state.streak > 0 ? 'Active Streak!' : 'Start Today',
      icon: Flame,
      color: '#F59E0B',
      trend: '+1d',
    },
    {
      label: 'Coins Earned',
      value: state.coins.toLocaleString(),
      sub: 'Total platform currency',
      icon: Star,
      color: '#10B981',
      trend: '+450',
    },
    {
      label: 'Overall Accuracy',
      value: `${overallAccuracy}%`,
      sub: `${state.correctAttempts}/${state.totalAttempts} Correct`,
      icon: Target,
      color: '#7C3AED',
      trend: '+3%',
    },
  ];

  // AI-powered insights logic
  const recommendations: any[] = weakSubjectIds.map(ws => {
    const subj = filteredSubjects.find(s => s.id === ws);
    return {
      id: ws,
      subject: subj?.name || 'General',
      title: `Practice ${subj?.name} Fundamentals`,
      description: `Your accuracy is currently ${getSubjectAccuracy(ws)}%. Let's improve it together!`,
      type: 'practice' as const,
    };
  }).slice(0, 2);

  if (recommendations.length < 3) {
    recommendations.push({
      id: continueSubject?.id || 'gen',
      subject: continueSubject?.name || 'Learning',
      title: `Finish ${continueSubject?.world || 'Current Module'}`,
      description: 'You are so close to completing this section. Keep up the momentum!',
      type: 'revision' as const,
    });
  }

  // Mock Recent Activities
  const recentActivities = [
    { id: '1', type: 'quiz' as const, title: 'Quiz Completed', subtitle: 'Physics Fundamentals - Motion', time: '2h ago', xp: 50 },
    { id: '2', type: 'chapter' as const, title: 'Chapter Mastered', subtitle: 'Chemical Reactivity', time: '5h ago', xp: 120 },
    { id: '3', type: 'badge' as const, title: 'New Achievement!', subtitle: 'Fast Learner Badge', time: '1d ago' },
    { id: '4', type: 'streak' as const, title: '3-Day Streak!', subtitle: 'Consistency pays off', time: '1d ago', xp: 25 },
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Welcome & Profile Section */}
      <section className="flex flex-col lg:flex-row items-stretch gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 rounded-[32px] overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 text-white shadow-xl shadow-indigo-200"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
                   <Sparkles size={20} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mt-2 leading-tight">Welcome to your <br />Learning Command Center</h2>
                <p className="text-base md:text-lg text-indigo-100 font-bold max-w-md mt-2 opacity-90 leading-relaxed italic">
                  "{quote}"
                </p>
                <div className="mt-4 flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/subjects')}
                    className="flex h-12 items-center gap-2 rounded-2xl bg-white px-6 font-black text-indigo-700 shadow-xl shadow-indigo-900/10 transition-all hover:bg-slate-50"
                  >
                    Start Learning <ArrowRight size={18} />
                  </motion.button>
                </div>
              </div>

              <div className="relative flex-shrink-0 flex items-center justify-center p-2 rounded-[32px] bg-white/10 backdrop-blur-md border border-white/20">
                <div className="flex flex-col items-center gap-4 px-6 py-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full border-4 border-white/30 p-1">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 text-4xl shadow-2xl">
                        {state.user?.avatar || '🎓'}
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-white shadow-lg shadow-amber-600/20">
                      <Award size={18} />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-black text-white">{state.user?.name}</h3>
                    <p className="text-xs font-bold text-indigo-200">Level {level} • {levelName}</p>
                  </div>
                  <div className="flex flex-col gap-1 w-full mt-2">
                     <div className="flex items-center justify-between text-[10px] font-black text-indigo-200 uppercase tracking-widest">
                       <span>Progress</span>
                       <span>{Math.round(xpProgressPercent)}%</span>
                     </div>
                     <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${xpProgressPercent}%` }}
                         transition={{ duration: 1, ease: 'easeOut' }}
                         className="h-full rounded-full bg-white" 
                       />
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section>
          <DashboardStats stats={topStatCards} />
        </section>

        {/* Analytics Section */}
        <section>
          <ActivityAnalytics xpData={xpChartData} radarData={radarData} />
        </section>

        {/* Recommendations & Activity Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2">
              <SmartInsights recommendations={recommendations} />
              
              {/* Subject Breakdown Card */}
              <div className="mt-8 rounded-[32px] border border-slate-100 bg-white p-7 shadow-sm transition-all hover:shadow-2xl hover:shadow-indigo-500/5">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-black text-slate-900">Curriculum Progress</h3>
                    <p className="text-sm font-semibold text-slate-400">{completedChapters} of {totalChapters} chapters mastered</p>
                  </div>
                  <button 
                    onClick={() => navigate('/subjects')}
                    className="flex h-9 items-center gap-1.5 rounded-xl bg-slate-50 px-4 text-xs font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    All Subjects <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSubjects.map(subject => {
                    const accuracy = getSubjectAccuracy(subject.id);
                    const completedInSubject = state.chapterProgress.filter(
                      p => p.subjectId === subject.id && p.completed
                    ).length;
                    const totalInSubject = subject.chapters.length;
                    const progressPct = (completedInSubject / totalInSubject) * 100;
                    
                    return (
                      <div key={subject.id} className="relative flex items-center gap-4 p-4 rounded-2xl border border-slate-50 bg-slate-50/20 group cursor-pointer transition-all hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform group-hover:scale-110">
                          <span className="text-2xl">{subject.icon}</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-slate-900">{subject.name}</span>
                            <span className="text-[10px] font-black text-indigo-600">{accuracy}% Accuracy</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-200/50 mt-1 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: `${progressPct}%` }}
                              className="h-full rounded-full bg-indigo-500 transition-all" 
                            />
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                            {completedInSubject}/{totalInSubject} Mastery
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
           </div>

           <div className="lg:col-span-1">
              <RecentActivity activities={recentActivities} />
              
              {/* Pro Promotion */}
              <div className="mt-6 rounded-[32px] overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 p-6 text-white shadow-xl shadow-amber-200 transition-transform hover:scale-[1.02] cursor-pointer">
                 <div className="flex items-start justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                       <Trophy size={20} />
                    </div>
                    <span className="rounded-lg bg-white/20 px-2 py-1 text-[10px] font-black uppercase">Save 40%</span>
                 </div>
                 <h4 className="text-lg font-black leading-tight">Elite Pass</h4>
                 <p className="text-xs font-bold text-amber-50 mt-1 opacity-90 leading-relaxed">
                   Unlock AI 1-on-1 sessions, personalized mock exams, and early access to new syllabus content.
                 </p>
                 <button className="mt-4 flex w-full h-11 items-center justify-center rounded-2xl bg-white font-black text-amber-600 shadow-xl transition-all hover:bg-slate-50">
                    Upgrade to Elite
                 </button>
              </div>
           </div>
      </section>
    </div>
  );
};
