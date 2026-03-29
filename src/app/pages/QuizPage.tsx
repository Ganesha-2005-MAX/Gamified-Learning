import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { useQuestions } from '../../hooks/useSupabaseData';
import { Question } from '../data/questions';
import confetti from 'canvas-confetti';
import { ArrowLeft, Zap, Clock, CheckCircle, XCircle, Lightbulb, SkipForward, Trophy, Star, Loader2 } from 'lucide-react';

const QUESTION_TIME = 30;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export const QuizPage: React.FC = () => {
  const { subjectId, chapterId } = useParams<{ subjectId: string; chapterId: string }>();
  const navigate = useNavigate();
  const { subjects, loading: subjectsLoading, addXP, addCoins, updateProgress, checkAndAwardBadges } = useGame();
  
  const { questions: rawQuestions, loading: questionsLoading } = useQuestions(subjectId!, chapterId!);

  const subject = subjects.find(s => s.id === subjectId);
  const chapter = subject?.chapters.find(c => c.id === chapterId);

  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!questionsLoading && rawQuestions.length > 0 && !initialized) {
      const pool = rawQuestions;
      const shuffled = shuffle(pool);
      const count = chapter?.isBossFight ? Math.min(15, shuffled.length) : Math.min(10, shuffled.length);
      setQuizQuestions(shuffled.slice(0, count));
      setInitialized(true);
    }
  }, [questionsLoading, rawQuestions, chapter, initialized]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [coinsGained, setCoinsGained] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showXpPop, setShowXpPop] = useState(false);
  const [xpPopAmount, setXpPopAmount] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentQ = quizQuestions[currentIdx] || ({} as Question);
  const isBoss = chapter?.isBossFight;
  const totalQ = quizQuestions.length;
  const progressPct = (currentIdx / Math.max(totalQ, 1)) * 100;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleGameOver = useCallback((finalCorrect: number, finalTotal: number, finalXp: number, finalCoins: number) => {
    stopTimer();
    setGameOver(true);
    updateProgress(subjectId!, chapterId!, finalCorrect, finalTotal);
    checkAndAwardBadges();
    if (finalCorrect === finalTotal && finalTotal > 0) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#00d4ff', '#8b5cf6', '#ffd700', '#00ff88'] });
    }
  }, [stopTimer, subjectId, chapterId, updateProgress, checkAndAwardBadges]);

  const handleAnswer = useCallback((answer: string) => {
    if (showFeedback) return;
    stopTimer();
    const isCorrect = answer === currentQ.correctAnswer.toString();
    setSelectedAnswer(answer);
    setShowFeedback(true);
    setAnswers(prev => [...prev, answer]);

    let xpAdd = 0, coinAdd = 0;
    if (isCorrect) {
      const speedBonus = timeLeft > 20 ? 30 : timeLeft > 10 ? 20 : 10;
      xpAdd = (chapter?.isBossFight ? 40 : 20) + speedBonus;
      coinAdd = chapter?.isBossFight ? 15 : 8;
      setCorrect(prev => prev + 1);
      setScore(prev => prev + (100 + timeLeft * 3));
      setXpGained(prev => prev + xpAdd);
      setCoinsGained(prev => prev + coinAdd);
      addXP(xpAdd);
      addCoins(coinAdd);
      setXpPopAmount(xpAdd);
      setShowXpPop(true);
      setTimeout(() => setShowXpPop(false), 1500);
    } else {
      setWrong(prev => prev + 1);
    }
  }, [showFeedback, currentQ, timeLeft, chapter, addXP, addCoins, stopTimer]);

  const handleNext = useCallback(() => {
    const nextIdx = currentIdx + 1;
    if (nextIdx >= totalQ) {
      handleGameOver(correct, totalQ - skipped, xpGained, coinsGained);
    } else {
      setCurrentIdx(nextIdx);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowHint(false);
      setTimeLeft(QUESTION_TIME);
    }
  }, [currentIdx, totalQ, correct, skipped, xpGained, coinsGained, handleGameOver]);

  const handleSkip = useCallback(() => {
    stopTimer();
    setSkipped(prev => prev + 1);
    setAnswers(prev => [...prev, null]);
    const nextIdx = currentIdx + 1;
    if (nextIdx >= totalQ) {
      handleGameOver(correct, totalQ - skipped - 1, xpGained, coinsGained);
    } else {
      setCurrentIdx(nextIdx);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setShowHint(false);
      setTimeLeft(QUESTION_TIME);
    }
  }, [stopTimer, currentIdx, totalQ, correct, skipped, xpGained, coinsGained, handleGameOver]);

  // Timer
  useEffect(() => {
    if (gameOver || showFeedback) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => stopTimer();
  }, [currentIdx, gameOver, showFeedback, stopTimer]);

  // Handle timeout separately
  useEffect(() => {
    if (timeLeft === 0 && !showFeedback && !gameOver) {
      stopTimer();
      setWrong(p => p + 1);
      setAnswers(prev => [...prev, null]);
      setShowFeedback(true);
      setSelectedAnswer('__timeout__');
    }
  }, [timeLeft, showFeedback, gameOver, stopTimer]);

  if (subjectsLoading || (questionsLoading && !initialized)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium">Entering the arena...</p>
      </div>
    );
  }

  if (!subject || !chapter || (initialized && quizQuestions.length === 0)) {
    return (
      <div style={{ background: '#F0F4FF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center p-8 bg-white rounded-[32px] shadow-xl max-w-md">
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>😕</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">No questions found</h2>
          <p className="text-slate-500 mb-6">We couldn't find any questions for this chapter in the database yet.</p>
          <button onClick={() => navigate(`/subjects/${subjectId}`)} className="edu-btn-primary w-full py-3 rounded-xl">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
  const stars = accuracy >= 90 ? 3 : accuracy >= 60 ? 2 : accuracy >= 30 ? 1 : 0;
  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft > 15 ? '#10B981' : timeLeft > 7 ? '#F59E0B' : '#EF4444';

  // ===== GAME OVER SCREEN =====
  if (gameOver) {
    return (
      <div style={{ background: '#F0F4FF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div
          style={{ width: '100%', maxWidth: 520 }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
          {/* Result Header */}
          <div className="text-center mb-6">
            {isBoss ? (
              <motion.div initial={{ rotate: -10, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}>
                <div style={{ fontSize: '5rem', marginBottom: 12 }}>{accuracy >= 70 ? '🏆' : '💀'}</div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: accuracy >= 70 ? '#4F46E5' : '#EF4444' }}>
                  {accuracy >= 70 ? 'Boss Defeated! 🎉' : 'Boss Won This Time...'}
                </h1>
              </motion.div>
            ) : (
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <div style={{ fontSize: '4rem', marginBottom: 12 }}>
                  {stars === 3 ? '🌟' : stars === 2 ? '⭐' : stars === 1 ? '✨' : '📚'}
                </div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>
                  {accuracy >= 90 ? 'Perfect!' : accuracy >= 70 ? 'Great Job!' : accuracy >= 50 ? 'Keep Going!' : 'Practice More!'}
                </h1>
              </motion.div>
            )}

            <div className="flex justify-center gap-2 mt-3">
              {[1, 2, 3].map(i => (
                <motion.div key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: i <= stars ? 1 : 0.5, rotate: 0 }} transition={{ delay: 0.3 + i * 0.15, type: 'spring' }}>
                  <Star size={32} fill={i <= stars ? '#F59E0B' : 'transparent'} style={{ color: i <= stars ? '#F59E0B' : '#E2E8F0' }} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="edu-card p-6 mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Correct', value: correct, icon: '✅', color: '#10B981' },
                { label: 'Wrong', value: wrong + skipped, icon: '❌', color: '#EF4444' },
                { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯', color: '#4F46E5' },
                { label: 'Score', value: score, icon: '💎', color: '#7C3AED' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-3 rounded-xl"
                  style={{ background: '#F8FAFF' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{stat.icon}</div>
                  <div style={{ color: stat.color, fontSize: '1.4rem', fontWeight: 800 }}>{stat.value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Rewards */}
            <motion.div
              className="flex justify-center gap-6 py-3 rounded-xl"
              style={{ background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.15)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}>
              <div className="flex items-center gap-2">
                <Zap size={16} color="#4F46E5" />
                <span style={{ color: '#4F46E5', fontWeight: 700 }}>+{xpGained} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🪙</span>
                <span style={{ color: '#D97706', fontWeight: 700 }}>+{coinsGained} Coins</span>
              </div>
            </motion.div>

            {/* Question Review */}
            {accuracy < 100 && (
              <div className="mt-4">
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Question Review</div>
                <div className="space-y-1 max-h-40 overflow-y-auto edu-scrollbar">
                  {quizQuestions.map((q, i) => (
                    <div key={q.id} className="flex items-center gap-2 py-1">
                      <span style={{ fontSize: '0.8rem' }}>{answers[i] === q.correctAnswer.toString() ? '✅' : '❌'}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }} className="truncate flex-1">{q.question.slice(0, 60)}...</span>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{q.correctAnswer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              onClick={() => navigate(`/subjects/${subjectId}`)}
              className="flex-1 py-3 rounded-xl"
              style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#374151', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              ← Back to Chapters
            </motion.button>
            <motion.button
              onClick={() => {
                setCurrentIdx(0); setSelectedAnswer(null); setShowFeedback(false);
                setShowHint(false); setTimeLeft(QUESTION_TIME); setScore(0);
                setCorrect(0); setWrong(0); setSkipped(0); setXpGained(0);
                setCoinsGained(0); setGameOver(false); setAnswers([]);
              }}
              className="flex-1 edu-btn-primary py-3 rounded-xl"
              style={{ fontSize: '0.9rem' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              🔄 Try Again
            </motion.button>
          </div>

          {accuracy >= 70 && !isBoss && (
            <motion.button
              onClick={() => navigate('/subjects')}
              className="w-full mt-3 py-3 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}>
              🏆 Next Chapter →
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  // ===== QUIZ SCREEN =====
  return (
    <div className="flex flex-col gap-8">
      {/* XP Pop */}
      <AnimatePresence>
        {showXpPop && (
          <motion.div
            className="fixed top-20 right-6 z-50 flex items-center gap-1 px-4 py-2 rounded-xl"
            style={{ background: '#4F46E5', color: '#fff' }}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}>
            <Zap size={14} />
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>+{xpPopAmount} XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Immersive Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/subjects/${subjectId}`)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors bg-white/50 px-3 py-1.5 rounded-lg border border-slate-200/50"
            style={{ fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            <ArrowLeft size={14} /> Exit Quiz
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
              <CheckCircle size={12} /> {correct}
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-100" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
              <XCircle size={12} /> {wrong}
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
              <Trophy size={11} /> {score}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex justify-between mb-1.5" style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
            <span>Question {currentIdx + 1} of {totalQ}</span>
            <span style={{ color: '#4F46E5', fontWeight: 600 }}>{Math.round(progressPct)}% done</span>
          </div>
          <div className="edu-progress-bar" style={{ height: 8 }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: isBoss ? 'linear-gradient(90deg, #EF4444, #7C3AED)' : 'linear-gradient(90deg, #4F46E5, #7C3AED)' }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Timer + Info Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke={timerColor}
                  strokeWidth="3"
                  strokeDasharray="100"
                  strokeDashoffset={100 - timerPct}
                  strokeLinecap="round"
                  className="timer-ring"
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center" style={{ fontSize: '0.7rem', fontWeight: 700, color: timerColor }}>
                {timeLeft}
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>seconds left</span>
          </div>
          {isBoss && (
            <div className="edu-badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '0.75rem' }}>
              ⚔️ BOSS FIGHT
            </div>
          )}
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            className="edu-card p-6 mb-4"
            style={{ border: isBoss ? '1.5px solid rgba(239,68,68,0.2)' : '1px solid #E2E8F0' }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>

            <div className="flex items-center gap-2 mb-4">
              <span className="edu-badge" style={{
                background: currentQ.difficulty === 1 ? 'rgba(16,185,129,0.1)' : currentQ.difficulty === 2 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                color: currentQ.difficulty === 1 ? '#10B981' : currentQ.difficulty === 2 ? '#D97706' : '#EF4444',
                fontSize: '0.72rem',
              }}>
                {currentQ.difficulty === 1 ? 'Easy' : currentQ.difficulty === 2 ? 'Medium' : 'Hard'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'capitalize' }}>{currentQ.type}</span>
            </div>

            <p style={{ color: '#1E293B', fontSize: '1rem', lineHeight: 1.7, fontWeight: 500 }}>
              {currentQ.question}
            </p>

            {showHint && currentQ.hint && (
              <motion.div
                className="mt-4 px-4 py-3 rounded-xl flex items-start gap-2"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}>
                <Lightbulb size={15} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: '0.85rem', color: '#92400E', lineHeight: 1.5 }}>{currentQ.hint}</span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        {currentQ.options && (
          <div className="grid grid-cols-1 gap-3 mb-4">
            {currentQ.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === currentQ.correctAnswer.toString();

              let bg = '#fff';
              let border = '#E2E8F0';
              let textColor = '#1E293B';

              if (showFeedback && isCorrectOption) {
                bg = 'rgba(16,185,129,0.06)';
                border = 'rgba(16,185,129,0.4)';
                textColor = '#065F46';
              } else if (showFeedback && isSelected && !isCorrectOption) {
                bg = 'rgba(239,68,68,0.06)';
                border = 'rgba(239,68,68,0.4)';
                textColor = '#991B1B';
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => !showFeedback && handleAnswer(option)}
                  className="w-full px-4 py-3.5 rounded-xl text-left transition-all"
                  style={{
                    background: bg,
                    border: `1.5px solid ${border}`,
                    color: textColor,
                    cursor: showFeedback ? 'default' : 'pointer',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }}
                  whileHover={!showFeedback ? { scale: 1.01, boxShadow: '0 4px 12px rgba(79,70,229,0.1)', borderColor: '#4F46E5' } : {}}
                  whileTap={!showFeedback ? { scale: 0.99 } : {}}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{
                        background: showFeedback && isCorrectOption
                          ? 'rgba(16,185,129,0.2)'
                          : showFeedback && isSelected && !isCorrectOption
                            ? 'rgba(239,68,68,0.2)'
                            : '#F1F5F9',
                        fontWeight: 700,
                        color: showFeedback && isCorrectOption ? '#10B981' : showFeedback && isSelected ? '#EF4444' : '#64748B',
                      }}>
                      {showFeedback && isCorrectOption ? '✓' : showFeedback && isSelected && !isCorrectOption ? '✗' : String.fromCharCode(65 + i)}
                    </span>
                    {option}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              className="edu-card p-4 mb-4"
              style={{
                border: selectedAnswer === currentQ.correctAnswer.toString()
                  ? '1.5px solid rgba(16,185,129,0.3)'
                  : '1.5px solid rgba(239,68,68,0.3)',
                background: selectedAnswer === currentQ.correctAnswer.toString()
                  ? 'rgba(16,185,129,0.03)'
                  : 'rgba(239,68,68,0.03)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                {selectedAnswer === currentQ.correctAnswer.toString() ? (
                  <CheckCircle size={16} color="#10B981" />
                ) : (
                  <XCircle size={16} color="#EF4444" />
                )}
                <span style={{
                  fontWeight: 700, fontSize: '0.9rem',
                  color: selectedAnswer === currentQ.correctAnswer.toString() ? '#10B981' : '#EF4444',
                }}>
                  {selectedAnswer === '__timeout__' ? '⏰ Time\'s up!' : selectedAnswer === currentQ.correctAnswer.toString() ? '✅ Correct!' : `❌ Wrong! Answer: ${currentQ.correctAnswer}`}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6 }}>{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!showFeedback && (
            <>
              {currentQ.hint && (
                <motion.button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#D97706', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}>
                  <Lightbulb size={14} /> Hint
                </motion.button>
              )}
              <motion.button
                onClick={handleSkip}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl ml-auto"
                style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#64748B', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}>
                <SkipForward size={14} /> Skip
              </motion.button>
            </>
          )}

          {showFeedback && (
            <motion.button
              onClick={handleNext}
              className="w-full edu-btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
              style={{ fontSize: '0.95rem' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}>
              {currentIdx + 1 >= totalQ ? '🏁 See Results' : 'Next Question →'}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};