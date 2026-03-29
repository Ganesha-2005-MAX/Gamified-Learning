import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Subject, Chapter } from '../app/data/subjects';
import { Question } from '../app/data/questions';

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        setLoading(true);
        // Fetch subjects and their chapters using Supabase's nested join
        const { data, error } = await supabase
          .from('subjects')
          .select('*, chapters(*)');

        if (error) throw error;

        // Transform data to match the local Subject interface (e.g., mapping subject_id to id)
        const transformed: Subject[] = (data || []).map((s: any) => ({
          ...s,
          chapters: (s.chapters || []).sort((a: any, b: any) => {
            // Ensure boss fight is last, otherwise order by difficulty
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
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, []);

  return { subjects, loading, error };
}

export function useQuestions(subjectId: string, chapterId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!subjectId || !chapterId) return;

    async function fetchQuestions() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('subject_id', subjectId)
          .eq('chapter_id', chapterId);

        if (error) throw error;

        // Transform data if needed (CamelCase mapping)
        const transformed: Question[] = (data || []).map((q: any) => ({
          id: q.id,
          subjectId: q.subject_id,
          chapterId: q.chapter_id,
          type: q.type,
          difficulty: q.difficulty,
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
          hint: q.hint,
          tags: q.tags || []
        }));

        setQuestions(transformed);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [subjectId, chapterId]);

  return { questions, loading, error };
}
