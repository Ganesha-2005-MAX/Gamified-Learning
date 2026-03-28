import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getLevelFromXP, getXPForNextLevel, LEVEL_NAMES, BADGES } from '../data/subjects';

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
  login: (user: UserProfile) => void;
  signup: (user: Omit<UserProfile, 'id' | 'joinedDate'>, password: string) => boolean;
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

  const level = getLevelFromXP(state.xp);
  const levelName = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
  const currentLevelXP = getXPForNextLevel(level - 1);
  const nextLevelXP = getXPForNextLevel(level);
  const xpForNextLevel = nextLevelXP;
  const xpProgressPercent = Math.min(((state.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100, 100);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(state));
  }, [state]);

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

  const signup = useCallback((userData: Omit<UserProfile, 'id' | 'joinedDate'>, _password: string): boolean => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find((u: UserProfile) => u.email === userData.email)) {
        return false;
      }
      const newUser: UserProfile = {
        ...userData,
        id: Date.now().toString(),
        joinedDate: new Date().toISOString(),
      };
      users.push({ ...newUser, password: _password });
      localStorage.setItem('users', JSON.stringify(users));
      login(newUser);
      return true;
    } catch {
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
      state, login, signup, logout, addXP, addCoins, spendCoins,
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
