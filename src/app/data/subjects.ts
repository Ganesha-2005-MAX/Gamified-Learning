export interface Chapter {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 1 | 2 | 3;
  xpReward: number;
  coinReward: number;
  isBossFight?: boolean;
  questionCount: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  secondaryColor: string;
  glowColor: string;
  description: string;
  world: string;
  class: '10' | '12';
  targetExams: string[];
  chapters: Chapter[];
}

export const subjects: Subject[] = [];

export const getSubject = (id: string) => subjects.find(s => s.id === id);
export const getChapter = (subjectId: string, chapterId: string) => {
  const subject = getSubject(subjectId);
  return subject?.chapters.find(c => c.id === chapterId);
};

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2700, 3700, 5000, 6500, 8500, 11000, 14000, 18000];
export const LEVEL_NAMES = ['Novice', 'Learner', 'Scholar', 'Thinker', 'Explorer', 'Achiever', 'Expert', 'Master', 'Champion', 'Legend', 'Genius', 'Prodigy', 'Virtuoso', 'Grandmaster', 'Immortal'];

export const getLevelFromXP = (xp: number) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
};

export const getXPForNextLevel = (level: number) => {
  return LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
};

export const BADGES = [
  { id: 'first_quiz', name: 'First Steps', icon: '👣', description: 'Complete your first quiz', color: '#00d4ff' },
  { id: 'streak_3', name: 'On Fire 🔥', icon: '🔥', description: '3-day streak', color: '#ff6b35' },
  { id: 'streak_7', name: 'Week Warrior', icon: '⚔️', description: '7-day streak', color: '#ffd700' },
  { id: 'streak_30', name: 'Month Master', icon: '🏆', description: '30-day streak', color: '#8b5cf6' },
  { id: 'perfect_quiz', name: 'Perfect Score', icon: '💯', description: 'Score 100% on a quiz', color: '#00ff88' },
  { id: 'speed_demon', name: 'Speed Demon', icon: '⚡', description: 'Answer 5 questions in under 5s each', color: '#00d4ff' },
  { id: 'physics_master', name: 'Physics Master', icon: '⚡', description: 'Complete all Physics levels', color: '#00d4ff' },
  { id: 'chemistry_master', name: 'Chemistry Wizard', icon: '🧪', description: 'Complete all Chemistry levels', color: '#00ff88' },
  { id: 'biology_master', name: 'Life Scientist', icon: '🧬', description: 'Complete all Biology levels', color: '#ff6b6b' },
  { id: 'math_master', name: 'Math Genius', icon: '📐', description: 'Complete all Math levels', color: '#ffd700' },
  { id: 'boss_slayer', name: 'Boss Slayer', icon: '🗡️', description: 'Defeat your first Boss Fight', color: '#8b5cf6' },
  { id: 'level_10', name: 'Double Digits', icon: '🎯', description: 'Reach Level 10', color: '#ffd700' },
  { id: '1000_xp', name: 'XP Hunter', icon: '💎', description: 'Earn 1000 XP', color: '#00d4ff' },
  { id: 'night_owl', name: 'Night Owl', icon: '🦉', description: 'Study after midnight', color: '#8b5cf6' },
];
