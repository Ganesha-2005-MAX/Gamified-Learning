import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { subjects } from '../data/subjects';
import { Lock, CheckCircle, Star, Zap, ArrowLeft, Play, Trophy, Target } from 'lucide-react';

const subjectColors: Record<string, { color: string; bg: string; light: string }> = {
  physics: { color: '#4F46E5', bg: 'rgba(79,70,229,0.08)', light: '#EEF2FF' },
  chemistry: { color: '#10B981', bg: 'rgba(16,185,129,0.08)', light: '#ECFDF5' },
  biology: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', light: '#FEF2F2' },
  mathematics: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', light: '#FFFBEB' },
};

const difficultyInfo = {
  1: { label: 'Easy', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  2: { label: 'Medium', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  3: { label: 'Hard', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

export const ChaptersPage: React.FC = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { state, getChapterProgress, getSubjectAccuracy } = useGame();
  const navigate = useNavigate();

  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) return null;

  const sc = subjectColors[subject.id] || { color: '#4F46E5', bg: 'rgba(79,70,229,0.08)', light: '#EEF2FF' };
  const accuracy = getSubjectAccuracy(subject.id);
  const completedChapters = state.chapterProgress.filter(
    p => p.subjectId === subject.id && p.completed
  ).length;
  const progressPct = (completedChapters / subject.chapters.length) * 100;

  const isChapterUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    const chapter = subject.chapters[index];
    if (chapter.isBossFight) {
      return subject.chapters.slice(0, index).every(ch => {
        const prog = getChapterProgress(subject.id, ch.id);
        return prog?.completed;
      });
    }
    const prev = subject.chapters[index - 1];
    const prevProg = getChapterProgress(subject.id, prev.id);
    return !!prevProg;
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <motion.button
          onClick={() => navigate('/subjects')}
          className="flex items-center gap-2 mb-6 transition-colors"
          style={{ color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
          whileHover={{ x: -2 }}>
          <ArrowLeft size={16} /> Back to Subjects
        </motion.button>
        {/* Subject Header Card */}
        <motion.div
          className="edu-card p-6 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-18 h-18 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: sc.light }}>
                {subject.icon}
              </div>
              <div>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>{subject.name}</h1>
                <div style={{ color: sc.color, fontWeight: 600, fontSize: '0.85rem', marginTop: 2 }}>{subject.world}</div>
                <div style={{ color: '#64748B', fontSize: '0.8rem', marginTop: 2 }}>{subject.description}</div>
              </div>
            </div>

            <div className="flex gap-6 md:ml-auto">
              {[
                { label: 'Accuracy', value: `${accuracy}%`, icon: Target, color: sc.color },
                { label: 'Completed', value: `${completedChapters}/${subject.chapters.length}`, icon: CheckCircle, color: '#10B981' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs mb-1.5" style={{ color: '#94A3B8' }}>
              <span>Overall Progress</span>
              <span style={{ color: sc.color, fontWeight: 600 }}>{Math.round(progressPct)}%</span>
            </div>
            <div className="edu-progress-bar" style={{ height: 8 }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: sc.color }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Chapters List */}
        <div className="space-y-3">
          {subject.chapters.map((chapter, idx) => {
            const progress = getChapterProgress(subject.id, chapter.id);
            const isUnlocked = isChapterUnlocked(idx);
            const isCompleted = progress?.completed;
            const isBoss = chapter.isBossFight;
            const chapterAccuracy = progress ? Math.round((progress.correct / Math.max(progress.attempts, 1)) * 100) : 0;
            const diff = difficultyInfo[chapter.difficulty];

            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}>
                {/* Boss Divider */}
                {isBoss && (
                  <div className="text-center py-2 mb-2 flex items-center gap-3">
                    <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                    <span className="edu-badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '0.75rem' }}>
                      ⚔️ Final Boss Battle
                    </span>
                    <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                  </div>
                )}

                <motion.div
                  className="edu-card p-5"
                  style={{
                    opacity: isUnlocked ? 1 : 0.55,
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    border: isBoss && isUnlocked ? '1.5px solid rgba(239,68,68,0.25)' : isCompleted ? `1.5px solid ${sc.color}25` : '1px solid #E2E8F0',
                    background: isBoss && isUnlocked ? 'linear-gradient(135deg, rgba(239,68,68,0.03), rgba(124,58,237,0.03))' : '#fff',
                  }}
                  whileHover={isUnlocked ? { y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } : {}}
                  whileTap={isUnlocked ? { scale: 0.99 } : {}}
                  onClick={() => isUnlocked && navigate(`/quiz/${subject.id}/${chapter.id}`)}>

                  <div className="flex items-center gap-4">
                    {/* Chapter Icon */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{
                        background: isCompleted ? sc.light : isBoss && isUnlocked ? 'rgba(239,68,68,0.08)' : '#F1F5F9',
                        border: isCompleted ? `1.5px solid ${sc.color}30` : 'none',
                      }}>
                      {isCompleted ? '✅' : !isUnlocked ? '🔒' : isBoss ? '⚔️' : chapter.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>{chapter.name}</span>
                        {isBoss && (
                          <span className="edu-badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '0.68rem', padding: '2px 8px' }}>
                            BOSS
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: 8 }}>{chapter.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="edu-badge" style={{ background: diff.bg, color: diff.color, padding: '3px 10px', fontSize: '0.72rem' }}>
                          {diff.label}
                        </span>
                        <span className="edu-badge" style={{ background: 'rgba(79,70,229,0.08)', color: '#4F46E5', padding: '3px 10px', fontSize: '0.72rem' }}>
                          <Zap size={10} /> +{chapter.xpReward} XP
                        </span>
                        <span className="edu-badge" style={{ background: 'rgba(245,158,11,0.08)', color: '#D97706', padding: '3px 10px', fontSize: '0.72rem' }}>
                          🪙 +{chapter.coinReward}
                        </span>
                        {progress && (
                          <span className="edu-badge" style={{ background: 'rgba(16,185,129,0.08)', color: '#10B981', padding: '3px 10px', fontSize: '0.72rem' }}>
                            {chapterAccuracy}% accuracy
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      {!isUnlocked ? (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F1F5F9' }}>
                          <Lock size={17} color="#CBD5E1" />
                        </div>
                      ) : isCompleted ? (
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3].map(i => (
                              <Star key={i} size={13} fill={chapterAccuracy >= i * 33 ? '#F59E0B' : 'transparent'} color="#F59E0B" />
                            ))}
                          </div>
                          <button
                            style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}25`, borderRadius: 8, padding: '5px 14px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
                            onClick={e => { e.stopPropagation(); navigate(`/quiz/${subject.id}/${chapter.id}`); }}>
                            Retry
                          </button>
                        </div>
                      ) : (
                        <motion.button
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl"
                          style={{
                            background: isBoss ? 'linear-gradient(135deg, #EF4444, #7C3AED)' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}>
                          <Play size={14} /> {isBoss ? 'Fight!' : 'Start'}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
  );
};
