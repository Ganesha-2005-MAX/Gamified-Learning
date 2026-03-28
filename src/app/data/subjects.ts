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
  chapters: Chapter[];
}

export const subjects: Subject[] = [
  {
    id: 'physics',
    name: 'Physics',
    icon: '⚡',
    color: '#00d4ff',
    secondaryColor: '#0099cc',
    glowColor: 'rgba(0, 212, 255, 0.4)',
    description: 'Master the laws of the universe',
    world: 'Quantum World',
    chapters: [
      { id: 'motion', name: 'Motion & Kinematics', icon: '🏃', description: 'Distance, displacement, velocity, acceleration', difficulty: 1, xpReward: 100, coinReward: 50, questionCount: 10 },
      { id: 'forces', name: "Newton's Laws", icon: '🔄', description: "Newton's three laws of motion", difficulty: 1, xpReward: 120, coinReward: 60, questionCount: 10 },
      { id: 'electricity', name: 'Electricity', icon: '🔋', description: 'Ohm\'s law, circuits, resistance', difficulty: 2, xpReward: 150, coinReward: 75, questionCount: 10 },
      { id: 'light', name: 'Light & Optics', icon: '🔦', description: 'Reflection, refraction, lenses', difficulty: 2, xpReward: 150, coinReward: 75, questionCount: 10 },
      { id: 'magnetic', name: 'Magnetism', icon: '🧲', description: 'Magnetic field, electromagnetic induction', difficulty: 2, xpReward: 160, coinReward: 80, questionCount: 10 },
      { id: 'modern', name: 'Modern Physics', icon: '☢️', description: 'Photoelectric effect, nuclear physics', difficulty: 3, xpReward: 200, coinReward: 100, questionCount: 10 },
      { id: 'thermodynamics', name: 'Thermodynamics', icon: '🔥', description: 'Heat, temperature, entropy', difficulty: 3, xpReward: 180, coinReward: 90, questionCount: 10 },
      { id: 'physics-boss', name: '⚡ BOSS: Physics Olympiad', icon: '🎯', description: 'Ultimate Physics Challenge — prove your mastery!', difficulty: 3, xpReward: 500, coinReward: 250, isBossFight: true, questionCount: 15 },
    ]
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: '🧪',
    color: '#00ff88',
    secondaryColor: '#00cc6a',
    glowColor: 'rgba(0, 255, 136, 0.4)',
    description: 'Unlock the secrets of matter',
    world: 'Molecular World',
    chapters: [
      { id: 'reactions', name: 'Chemical Reactions', icon: '💥', description: 'Types of reactions, balancing equations', difficulty: 1, xpReward: 100, coinReward: 50, questionCount: 10 },
      { id: 'acids-bases', name: 'Acids & Bases', icon: '⚗️', description: 'pH, indicators, neutralization', difficulty: 1, xpReward: 120, coinReward: 60, questionCount: 10 },
      { id: 'metals', name: 'Metals & Non-metals', icon: '⛏️', description: 'Properties, reactivity series', difficulty: 2, xpReward: 140, coinReward: 70, questionCount: 10 },
      { id: 'carbon', name: 'Carbon Compounds', icon: '💎', description: 'Organic chemistry, hydrocarbons', difficulty: 2, xpReward: 160, coinReward: 80, questionCount: 10 },
      { id: 'periodic', name: 'Periodic Table', icon: '📊', description: 'Groups, periods, periodic trends', difficulty: 2, xpReward: 150, coinReward: 75, questionCount: 10 },
      { id: 'electrochemistry', name: 'Electrochemistry', icon: '⚡', description: 'Electrolysis, galvanic cells', difficulty: 3, xpReward: 190, coinReward: 95, questionCount: 10 },
      { id: 'chemistry-boss', name: '🧪 BOSS: Lab Master', icon: '🎯', description: 'Ultimate Chemistry Challenge — ace every reaction!', difficulty: 3, xpReward: 500, coinReward: 250, isBossFight: true, questionCount: 15 },
    ]
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: '🧬',
    color: '#ff6b6b',
    secondaryColor: '#cc5555',
    glowColor: 'rgba(255, 107, 107, 0.4)',
    description: 'Explore the science of life',
    world: 'Bio World',
    chapters: [
      { id: 'life-processes', name: 'Life Processes', icon: '🌱', description: 'Nutrition, respiration, transport', difficulty: 1, xpReward: 100, coinReward: 50, questionCount: 10 },
      { id: 'reproduction', name: 'Reproduction', icon: '🌸', description: 'Sexual and asexual reproduction', difficulty: 1, xpReward: 120, coinReward: 60, questionCount: 10 },
      { id: 'heredity', name: 'Heredity & Genetics', icon: '🧬', description: 'Mendel\'s laws, DNA, chromosomes', difficulty: 2, xpReward: 150, coinReward: 75, questionCount: 10 },
      { id: 'evolution', name: 'Evolution', icon: '🦕', description: 'Natural selection, adaptation, Darwin', difficulty: 2, xpReward: 140, coinReward: 70, questionCount: 10 },
      { id: 'nervous-system', name: 'Control & Coordination', icon: '🧠', description: 'Nervous system, hormones, reflexes', difficulty: 2, xpReward: 160, coinReward: 80, questionCount: 10 },
      { id: 'ecology', name: 'Ecology & Environment', icon: '🌍', description: 'Ecosystems, food chains, conservation', difficulty: 2, xpReward: 150, coinReward: 75, questionCount: 10 },
      { id: 'biology-boss', name: '🧬 BOSS: Life Scientist', icon: '🎯', description: 'Ultimate Biology Challenge — unravel life\'s mysteries!', difficulty: 3, xpReward: 500, coinReward: 250, isBossFight: true, questionCount: 15 },
    ]
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '📐',
    color: '#ffd700',
    secondaryColor: '#ccac00',
    glowColor: 'rgba(255, 215, 0, 0.4)',
    description: 'Conquer numbers and beyond',
    world: 'Number World',
    chapters: [
      { id: 'real-numbers', name: 'Real Numbers', icon: '🔢', description: 'Euclid\'s algorithm, HCF, LCM, irrationals', difficulty: 1, xpReward: 100, coinReward: 50, questionCount: 10 },
      { id: 'polynomials', name: 'Polynomials', icon: '📈', description: 'Zeros, division algorithm, factorization', difficulty: 1, xpReward: 120, coinReward: 60, questionCount: 10 },
      { id: 'linear-eq', name: 'Linear Equations', icon: '➗', description: 'System of equations, graphical method', difficulty: 1, xpReward: 120, coinReward: 60, questionCount: 10 },
      { id: 'quadratic', name: 'Quadratic Equations', icon: '📉', description: 'Discriminant, roots, nature of roots', difficulty: 2, xpReward: 150, coinReward: 75, questionCount: 10 },
      { id: 'trigonometry', name: 'Trigonometry', icon: '📐', description: 'Sin, cos, tan, identities', difficulty: 2, xpReward: 160, coinReward: 80, questionCount: 10 },
      { id: 'statistics', name: 'Statistics & Probability', icon: '📊', description: 'Mean, median, mode, probability', difficulty: 2, xpReward: 150, coinReward: 75, questionCount: 10 },
      { id: 'calculus', name: 'Calculus Basics', icon: '∫', description: 'Limits, derivatives, integrals', difficulty: 3, xpReward: 200, coinReward: 100, questionCount: 10 },
      { id: 'math-boss', name: '📐 BOSS: Math Olympiad', icon: '🎯', description: 'Ultimate Math Challenge — solve the unsolvable!', difficulty: 3, xpReward: 500, coinReward: 250, isBossFight: true, questionCount: 15 },
    ]
  }
];

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
