import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLevelFromXP, getXPForNextLevel, LEVEL_NAMES, Subject } from '../data/subjects';
import { supabase } from '../../lib/supabase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  class: '10' | '12';
  targetExam: 'Boards' | 'NEET' | 'CUET' | 'JEE';
  avatar: string;
  joinedDate: string;
}

export interface ChapterProgress {
  subjectId: string;
  chapterId: string;
  attempts: number;
  correct: number;
  completed: boolean;
  bestAccuracy: number;
  lastAttempted: string;
}

export interface DailyStats {
  date: string;
  xpEarned: number;
  questionsAttempted: number;
  correct: number;
}

export interface GameState {
  user: UserProfile | null;
  xp: number;
  coins: number;
  streak: number;
  lastLoginDate: string;
  chapterProgress: ChapterProgress[];
  badges: string[];
  totalAttempts: number;
  correctAttempts: number;
  dailyStats: DailyStats[];
  openAIKey: string;
}

interface GameContextType {
  state: GameState;
  subjects: Subject[];
  filteredSubjects: Subject[];
  loading: boolean;
  login: (user: UserProfile) => void;
  signup: (user: Omit<UserProfile, 'id' | 'joinedDate'>, password: string) => Promise<boolean>;
  logout: () => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  updateProgress: (subjectId: string, chapterId: string, correct: number, total: number) => void;
  unlockBadge: (badgeId: string) => void;
  checkAndAwardBadges: () => void;
  level: number;
  levelName: string;
  xpForNextLevel: number;
  xpProgressPercent: number;
  getChapterProgress: (subjectId: string, chapterId: string) => ChapterProgress | undefined;
  getSubjectAccuracy: (subjectId: string) => number;
  getWeakSubjects: () => string[];
  updateStreak: () => void;
  setOpenAIKey: (key: string) => void;
}

const defaultState: GameState = {
  user: null,
  xp: 0,
  coins: 0,
  streak: 0,
  lastLoginDate: '',
  chapterProgress: [],
  badges: [],
  totalAttempts: 0,
  correctAttempts: 0,
  dailyStats: [],
  openAIKey: '',
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem('gameState');
      return saved ? JSON.parse(saved) : defaultState;
    } catch {
      return defaultState;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch subjects on mount
  useEffect(() => {
    async function fetchSubjects() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('subjects')
          .select('*, chapters(*)');

        if (error) throw error;

        const transformed: Subject[] = (data || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          icon: s.icon,
          color: s.color,
          secondaryColor: s.secondary_color,
          glowColor: s.glow_color,
          description: s.description,
          world: s.world,
          class: s.class || '10',
          targetExams: s.target_exams || [],
          chapters: (s.chapters || []).sort((a: any, b: any) => {
            if (a.is_boss_fight) return 1;
            if (b.is_boss_fight) return -1;
            return a.difficulty - b.difficulty;
          }).map((c: any) => ({
             id: c.id,
             name: c.name,
             icon: c.icon,
             description: c.description,
             difficulty: c.difficulty,
             xpReward: c.xp_reward,
             coinReward: c.coin_reward,
             isBossFight: c.is_boss_fight,
             questionCount: c.question_count
          }))
        }));

        setSubjects(transformed);
      } catch (err) {
        console.error('Failed to fetch subjects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSubjects();
  }, []);

  // Auth/Profile Sync Logic
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setState(prev => ({ ...prev, user: null }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      setLoading(true);
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileErr && profileErr.code !== 'PGRST116') throw profileErr;

      if (profile) {
        const { data: stats, error: statsErr } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        const { data: progress, error: progressErr } = await supabase
          .from('chapter_progress')
          .select('*')
          .eq('user_id', userId);

        const { data: daily, error: dailyErr } = await supabase
          .from('daily_stats')
          .select('*')
          .eq('user_id', userId);

        setState(prev => ({
          ...prev,
          user: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            class: profile.class,
            targetExam: profile.target_exam,
            avatar: profile.avatar,
            joinedDate: profile.created_at,
          },
          xp: stats?.xp || 0,
          coins: stats?.coins || 0,
          streak: stats?.streak || 0,
          totalAttempts: stats?.total_attempts || 0,
          correctAttempts: stats?.correct_attempts || 0,
          chapterProgress: (progress || []).map(p => ({
            subjectId: p.subject_id,
            chapterId: p.chapter_id,
            attempts: p.attempts,
            correct: p.correct,
            completed: p.completed,
            bestAccuracy: p.best_accuracy,
            lastAttempted: p.last_attempted,
          })),
          dailyStats: (daily || []).map(d => ({
            date: d.date,
            xpEarned: d.xp_earned,
            questionsAttempted: d.questions_attempted,
            correct: d.correct_count,
          })),
        }));
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = React.useMemo(() => {
    if (!state.user) {
      // Default for guests: Class 10 Boards
      return subjects.filter(s => s.class === '10' && s.targetExams.includes('Boards'));
    }
    return subjects.filter(s => {
      const classMatches = s.class === state.user?.class;
      const examMatches = s.targetExams.includes(state.user?.targetExam || 'Boards');
      return classMatches && examMatches;
    });
  }, [subjects, state.user]);

  const level = getLevelFromXP(state.xp);
  const levelName = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
  const currentLevelXP = getXPForNextLevel(level - 1);
  const nextLevelXP = getXPForNextLevel(level);
  const xpForNextLevel = nextLevelXP;
  const xpProgressPercent = Math.min(((state.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100, 100);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(state));
    
    // Sync to Supabase if logged in
    if (state.user) {
      syncToSupabase();
    }
  }, [state]);

  const syncToSupabase = useCallback(async () => {
    if (!state.user) return;
    try {
      // Sync stats
      await supabase.from('user_stats').upsert({
        user_id: state.user.id,
        xp: state.xp,
        coins: state.coins,
        streak: state.streak,
        total_attempts: state.totalAttempts,
        correct_attempts: state.correctAttempts,
        last_login_date: new Date().toISOString()
      });

      // Sync progress (batch update would be better, but standard for now)
      for (const p of state.chapterProgress) {
        await supabase.from('chapter_progress').upsert({
          user_id: state.user.id,
          subject_id: p.subjectId,
          chapter_id: p.chapterId,
          attempts: p.attempts,
          correct: p.correct,
          completed: p.completed,
          best_accuracy: p.bestAccuracy,
          last_attempted: p.lastAttempted
        });
      }

      // Sync daily stats
      for (const d of state.dailyStats) {
        await supabase.from('daily_stats').upsert({
          user_id: state.user.id,
          date: d.date,
          xp_earned: d.xpEarned,
          questions_attempted: d.questionsAttempted,
          correct_count: d.correct
        });
      }
    } catch (err) {
      console.error('Sync failed:', err);
    }
  }, [state.user, state.xp, state.coins, state.streak, state.totalAttempts, state.correctAttempts, state.chapterProgress, state.dailyStats]);

  const login = useCallback((user: UserProfile) => {
    setState(prev => {
      const today = new Date().toDateString();
      let newStreak = prev.streak;
      let coinsBonus = 0;
      
      if (prev.lastLoginDate) {
        const lastDate = new Date(prev.lastLoginDate);
        const todayDate = new Date();
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak += 1;
          coinsBonus = 20 + Math.min(newStreak * 5, 50);
        } else if (diffDays > 1) {
          newStreak = 1;
          coinsBonus = 20;
        }
      } else {
        newStreak = 1;
        coinsBonus = 20;
      }

      return {
        ...prev,
        user,
        streak: newStreak,
        lastLoginDate: today,
        coins: prev.coins + coinsBonus,
      };
    });
  }, []);

  const signup = useCallback(async (userData: Omit<UserProfile, 'id' | 'joinedDate'>, _password: string): Promise<boolean> => {
    try {
      // 1. Create Supabase Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: _password,
        options: {
          data: {
            name: userData.name,
            class: userData.class,
            target_exam: userData.targetExam,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) return false;

      const newUser: UserProfile = {
        ...userData,
        id: authData.user.id,
        joinedDate: new Date().toISOString(),
      };

      // 2. Create Profile record
      await supabase.from('profiles').insert({
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        class: userData.class,
        target_exam: userData.targetExam,
        avatar: userData.avatar
      });

      // 3. Initialize stats
      await supabase.from('user_stats').insert({
        user_id: authData.user.id,
        xp: 0,
        coins: 0
      });

      login(newUser);
      return true;
    } catch (err) {
      console.error('Signup failed:', err);
      return false;
    }
  }, [login]);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, user: null }));
  }, []);

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const today = new Date().toDateString();
      const dailyStats = [...prev.dailyStats];
      const todayIdx = dailyStats.findIndex(d => d.date === today);
      if (todayIdx >= 0) {
        dailyStats[todayIdx].xpEarned += amount;
      } else {
        dailyStats.push({ date: today, xpEarned: amount, questionsAttempted: 0, correct: 0 });
      }
      return { ...prev, xp: prev.xp + amount, dailyStats };
    });
  }, []);

  const addCoins = useCallback((amount: number) => {
    setState(prev => ({ ...prev, coins: prev.coins + amount }));
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    if (state.coins < amount) return false;
    setState(prev => ({ ...prev, coins: prev.coins - amount }));
    return true;
  }, [state.coins]);

  const updateProgress = useCallback((subjectId: string, chapterId: string, correct: number, total: number) => {
    setState(prev => {
      const today = new Date().toDateString();
      const existing = prev.chapterProgress.find(p => p.subjectId === subjectId && p.chapterId === chapterId);
      const accuracy = total > 0 ? (correct / total) * 100 : 0;
      
      let newProgress: ChapterProgress;
      if (existing) {
        newProgress = {
          ...existing,
          attempts: existing.attempts + total,
          correct: existing.correct + correct,
          completed: existing.completed || accuracy >= 70,
          bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
          lastAttempted: today,
        };
      } else {
        newProgress = {
          subjectId, chapterId,
          attempts: total,
          correct,
          completed: accuracy >= 70,
          bestAccuracy: accuracy,
          lastAttempted: today,
        };
      }

      const chapterProgress = prev.chapterProgress.filter(
        p => !(p.subjectId === subjectId && p.chapterId === chapterId)
      );
      chapterProgress.push(newProgress);

      // Update daily stats
      const dailyStats = [...prev.dailyStats];
      const todayIdx = dailyStats.findIndex(d => d.date === today);
      if (todayIdx >= 0) {
        dailyStats[todayIdx].questionsAttempted += total;
        dailyStats[todayIdx].correct += correct;
      } else {
        dailyStats.push({ date: today, xpEarned: 0, questionsAttempted: total, correct });
      }

      return {
        ...prev,
        chapterProgress,
        totalAttempts: prev.totalAttempts + total,
        correctAttempts: prev.correctAttempts + correct,
        dailyStats,
      };
    });
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setState(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      return { ...prev, badges: [...prev.badges, badgeId] };
    });
  }, []);

  const checkAndAwardBadges = useCallback(() => {
    setState(prev => {
      const newBadges = [...prev.badges];
      const add = (id: string) => { if (!newBadges.includes(id)) newBadges.push(id); };

      if (prev.totalAttempts >= 1) add('first_quiz');
      if (prev.streak >= 3) add('streak_3');
      if (prev.streak >= 7) add('streak_7');
      if (prev.streak >= 30) add('streak_30');
      if (prev.xp >= 1000) add('1000_xp');
      if (getLevelFromXP(prev.xp) >= 10) add('level_10');
      
      const hour = new Date().getHours();
      if (hour >= 0 && hour < 4) add('night_owl');

      // Check subject completions
      const subjects = ['physics', 'chemistry', 'biology', 'mathematics'];
      subjects.forEach(subj => {
        const bossChapterId = `${subj}-boss`.replace('mathematics-boss', 'math-boss');
        const bossCompleted = prev.chapterProgress.find(p => p.subjectId === subj && p.chapterId === bossChapterId && p.completed);
        if (bossCompleted) add(`${subj}_master`);
        
        const bossProgress = prev.chapterProgress.find(p => p.chapterId.includes('boss') && p.completed);
        if (bossProgress) add('boss_slayer');
      });

      return { ...prev, badges: newBadges };
    });
  }, []);

  const updateStreak = useCallback(() => {
    setState(prev => {
      const today = new Date().toDateString();
      if (prev.lastLoginDate === today) return prev;
      
      let newStreak = prev.streak;
      if (prev.lastLoginDate) {
        const lastDate = new Date(prev.lastLoginDate);
        const todayDate = new Date();
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) newStreak += 1;
        else if (diffDays > 1) newStreak = 1;
      } else {
        newStreak = 1;
      }
      return { ...prev, streak: newStreak, lastLoginDate: today };
    });
  }, []);

  const getChapterProgress = useCallback((subjectId: string, chapterId: string) => {
    return state.chapterProgress.find(p => p.subjectId === subjectId && p.chapterId === chapterId);
  }, [state.chapterProgress]);

  const getSubjectAccuracy = useCallback((subjectId: string): number => {
    const subjectProgress = state.chapterProgress.filter(p => p.subjectId === subjectId);
    if (subjectProgress.length === 0) return 0;
    const totalAttempts = subjectProgress.reduce((sum, p) => sum + p.attempts, 0);
    const totalCorrect = subjectProgress.reduce((sum, p) => sum + p.correct, 0);
    return totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  }, [state.chapterProgress]);

  const getWeakSubjects = useCallback((): string[] => {
    const subjectIds = ['physics', 'chemistry', 'biology', 'mathematics'];
    return subjectIds.filter(id => {
      const accuracy = getSubjectAccuracy(id);
      return accuracy > 0 && accuracy < 60;
    });
  }, [getSubjectAccuracy]);

  const setOpenAIKey = useCallback((key: string) => {
    setState(prev => ({ ...prev, openAIKey: key }));
  }, []);

  return (
    <GameContext.Provider value={{
      state, subjects, filteredSubjects, loading, login, signup, logout, addXP, addCoins, spendCoins,
      updateProgress, unlockBadge, checkAndAwardBadges,
      level, levelName, xpForNextLevel, xpProgressPercent,
      getChapterProgress, getSubjectAccuracy, getWeakSubjects,
      updateStreak, setOpenAIKey,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
