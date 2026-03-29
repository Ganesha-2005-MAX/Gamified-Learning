export interface Question {
  id: string;
  subjectId: string;
  chapterId: string;
  type: 'mcq' | 'numerical';
  difficulty: 1 | 2 | 3;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hint?: string;
  tags: string[];
}

export const questions: Question[] = [];

export const getQuestionsByChapter = (subjectId: string, chapterId: string): Question[] => {
  const filtered = questions.filter(q => q.subjectId === subjectId && q.chapterId === chapterId);
  return filtered.length > 0 ? filtered : questions.filter(q => q.subjectId === subjectId).slice(0, 10);
};

export const getQuestionsBySubject = (subjectId: string): Question[] => {
  return questions.filter(q => q.subjectId === subjectId);
};

export const getQuestionById = (id: string): Question | undefined => {
  return questions.find(q => q.id === id);
};

export const shuffleQuestions = (qs: Question[]): Question[] => {
  return [...qs].sort(() => Math.random() - 0.5);
};
