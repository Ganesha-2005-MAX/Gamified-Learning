import React from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useGame } from '../context/GameContext';
import { subjects } from '../data/subjects';
import { ChevronRight, FileText, BookOpen, Target, Zap } from 'lucide-react';

const subjectColors: Record<string, { color: string; bg: string; light: string }> = {
  physics: { color: '#4F46E5', bg: 'rgba(79,70,229,0.08)', light: '#EEF2FF' },
  chemistry: { color: '#10B981', bg: 'rgba(16,185,129,0.08)', light: '#ECFDF5' },
  biology: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', light: '#FEF2F2' },
  mathematics: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', light: '#FFFBEB' },
};

export const SubjectsPage: React.FC = () => {
  const { state, getSubjectAccuracy, getChapterProgress } = useGame();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* Subject Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
          {subjects.map((subject, i) => {
            const sc = subjectColors[subject.id] || { color: '#4F46E5', bg: 'rgba(79,70,229,0.08)', light: '#EEF2FF' };
            const completed = state.chapterProgress.filter(p => p.subjectId === subject.id && p.completed).length;
            const acc = getSubjectAccuracy(subject.id);
            return (
              <motion.div
                key={subject.id}
                className="edu-card-hover p-4 flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(`/subjects/${subject.id}`)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: sc.bg }}>
                  {subject.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.88rem' }}>{subject.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{completed}/{subject.chapters.length} ch · {acc}%</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Subject Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {subjects.map((subject, sIdx) => {
            const sc = subjectColors[subject.id] || { color: '#4F46E5', bg: 'rgba(79,70,229,0.08)', light: '#EEF2FF' };
            const accuracy = getSubjectAccuracy(subject.id);
            const completedChapters = state.chapterProgress.filter(
              p => p.subjectId === subject.id && p.completed
            ).length;
            const totalChapters = subject.chapters.length;
            const progressPct = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
            const totalXP = subject.chapters.reduce((sum, c) => sum + c.xpReward, 0);

            return (
              <motion.div
                key={subject.id}
                className="edu-card p-6 cursor-pointer group"
                style={{ transition: 'all 0.25s ease' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sIdx * 0.1 }}
                whileHover={{ y: -4, boxShadow: `0 12px 40px ${sc.color}20`, borderColor: `${sc.color}30` }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(`/subjects/${subject.id}`)}>

                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
                      style={{ background: sc.light }}>
                      {subject.icon}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{subject.name}</h2>
                      <div style={{ fontSize: '0.82rem', color: sc.color, fontWeight: 600, marginTop: 2 }}>{subject.world}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: 2 }}>{subject.description}</div>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                    style={{ background: sc.bg }}>
                    <ChevronRight size={18} color={sc.color} />
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 500 }}>Chapter Progress</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: sc.color }}>{completedChapters}/{totalChapters}</span>
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

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { icon: Target, label: 'Accuracy', value: `${accuracy}%`, color: sc.color },
                    { icon: Zap, label: 'XP Available', value: totalXP.toString(), color: '#7C3AED' },
                    { icon: BookOpen, label: 'Chapters', value: totalChapters.toString(), color: '#10B981' },
                  ].map(stat => (
                    <div key={stat.label} className="text-center p-3 rounded-xl" style={{ background: '#F8FAFF' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Chapter Dots */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {subject.chapters.slice(0, 6).map(ch => {
                    const prog = getChapterProgress(subject.id, ch.id);
                    return (
                      <div
                        key={ch.id}
                        className="px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                        style={{
                          background: prog?.completed ? sc.light : '#F1F5F9',
                          border: `1px solid ${prog?.completed ? sc.color + '40' : '#E2E8F0'}`,
                        }}
                        title={ch.name}>
                        <span style={{ fontSize: '0.7rem' }}>{prog?.completed ? '✓' : ch.icon}</span>
                        <span style={{ fontSize: '0.68rem', color: prog?.completed ? sc.color : '#94A3B8', fontWeight: prog?.completed ? 600 : 400, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ch.name.length > 12 ? ch.name.slice(0, 12) + '…' : ch.name}
                        </span>
                      </div>
                    );
                  })}
                  {subject.chapters.length > 6 && (
                    <div className="px-3 py-1.5 rounded-lg" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>+{subject.chapters.length - 6} more</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl"
                  style={{ background: sc.bg, border: `1px solid ${sc.color}20` }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: sc.color }}>
                    {completedChapters === 0 ? '📚 Start Learning' : completedChapters === totalChapters ? '🎓 Subject Complete!' : '▶ Continue Learning'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Exam Simulator Banner */}
        <motion.div
          className="edu-card mt-5 p-6 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #4338CA, #6D28D9)', border: 'none' }}
          onClick={() => navigate('/exam')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <FileText size={28} color="white" />
            </div>
            <div>
              <h3 style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>Exam Simulator Mode</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                Full-length CBSE/NEET mock test with timer and detailed analysis
              </p>
            </div>
          </div>
          <button
            style={{ background: '#fff', color: '#4F46E5', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
            Take Mock Exam →
          </button>
        </motion.div>
      </div>
  );
};
