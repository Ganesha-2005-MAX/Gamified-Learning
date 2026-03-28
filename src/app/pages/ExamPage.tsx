import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { questions, Question } from '../data/questions';
import { subjects } from '../data/subjects';
import { Clock, AlertCircle, CheckCircle, XCircle, BarChart2, ArrowLeft, ArrowRight, Flag, Zap, LogOut } from 'lucide-react';
import confetti from 'canvas-confetti';

type ExamType = 'CBSE_10' | 'CBSE_12' | 'NEET' | 'CUET';
type ExamStatus = 'setup' | 'running' | 'finished';

interface ExamConfig {
  name: string;
  totalQ: number;
  durationMin: number;
  negativeMarking: number;
  correctMarks: number;
  subjects: string[];
  icon: string;
}

const EXAM_CONFIGS: Record<ExamType, ExamConfig> = {
  CBSE_10: { name: 'CBSE Class 10 Mock', totalQ: 30, durationMin: 45, negativeMarking: 0, correctMarks: 1, subjects: ['physics', 'chemistry', 'biology', 'mathematics'], icon: '📚' },
  CBSE_12: { name: 'CBSE Class 12 Mock', totalQ: 35, durationMin: 60, negativeMarking: 0, correctMarks: 1, subjects: ['physics', 'chemistry', 'biology', 'mathematics'], icon: '🎓' },
  NEET: { name: 'NEET Mock Test', totalQ: 40, durationMin: 60, negativeMarking: 0.25, correctMarks: 4, subjects: ['physics', 'chemistry', 'biology'], icon: '🏥' },
  CUET: { name: 'CUET Mock Test', totalQ: 30, durationMin: 45, negativeMarking: 0.25, correctMarks: 5, subjects: ['physics', 'chemistry', 'biology', 'mathematics'], icon: '🎯' },
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildExamQuestions(config: ExamConfig): Question[] {
  const perSubject = Math.floor(config.totalQ / config.subjects.length);
  const pool: Question[] = [];
  config.subjects.forEach(subj => {
    const subjectQs = shuffle(questions.filter(q => q.subjectId === subj)).slice(0, perSubject);
    pool.push(...subjectQs);
  });
  return shuffle(pool).slice(0, config.totalQ);
}

export const ExamPage: React.FC = () => {
  const navigate = useNavigate();
  const { addXP, addCoins } = useGame();
  const [examType, setExamType] = useState<ExamType>('NEET');
  const [status, setStatus] = useState<ExamStatus>('setup');
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [markedForReview, setMarkedForReview] = useState<boolean[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const answersRef = useRef<(string | null)[]>([]);

  // Keep answersRef in sync
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const config = EXAM_CONFIGS[examType];

  const finishExam = useCallback((currentAnswers: (string | null)[], qs: Question[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    let correct = 0, wrong = 0, unattempted = 0;
    let rawScore = 0;

    qs.forEach((q, i) => {
      const ans = currentAnswers[i];
      if (!ans) { unattempted++; }
      else if (ans === q.correctAnswer.toString()) {
        correct++;
        rawScore += config.correctMarks;
      } else {
        wrong++;
        rawScore -= config.negativeMarking;
      }
    });

    const maxScore = qs.length * config.correctMarks;
    const percentage = Math.round((rawScore / maxScore) * 100);
    const xpEarned = Math.max(0, Math.round(rawScore * 5));
    const coinsEarned = Math.max(0, Math.round(rawScore * 2));

    if (xpEarned > 0) { addXP(xpEarned); addCoins(coinsEarned); }
    if (percentage >= 60) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    setResult({ correct, wrong, unattempted, rawScore: Math.max(0, rawScore), maxScore, percentage, xpEarned, coinsEarned });
    setStatus('finished');
  }, [config, addXP, addCoins]);

  useEffect(() => {
    if (status !== 'running') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          finishExam(answersRef.current, examQuestions);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [status, examQuestions, finishExam]);

  const startExam = () => {
    const qs = buildExamQuestions(config);
    setExamQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setMarkedForReview(new Array(qs.length).fill(false));
    setCurrentIdx(0);
    setTimeLeft(config.durationMin * 60);
    setStatus('running');
    setResult(null);
  };

  const selectAnswer = (answer: string) => {
    setAnswers(prev => {
      const next = [...prev];
      next[currentIdx] = answer;
      return next;
    });
  };

  const toggleReview = () => {
    setMarkedForReview(prev => {
      const next = [...prev];
      next[currentIdx] = !next[currentIdx];
      return next;
    });
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timerPct = timeLeft / (config.durationMin * 60);
  const timerColor = timerPct > 0.5 ? '#10B981' : timerPct > 0.25 ? '#F59E0B' : '#EF4444';
  const attemptedCount = answers.filter(a => a !== null).length;
  const reviewCount = markedForReview.filter(Boolean).length;

  // ===== SETUP SCREEN =====
  if (status === 'setup') {
    return (
      <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
        <motion.button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 mb-2 self-start text-slate-400 hover:text-indigo-600 transition-colors"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
          whileHover={{ x: -2 }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </motion.button>

        <div className="flex flex-col items-center">
          <div style={{ width: '100%', maxWidth: 700 }}>
            {/* Exam Type Selection */}
            <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Select Exam Type</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {(Object.entries(EXAM_CONFIGS) as [ExamType, ExamConfig][]).map(([type, cfg], i) => (
                <motion.div
                  key={type}
                  onClick={() => setExamType(type)}
                  className="edu-card p-5 cursor-pointer group transition-all"
                  style={{
                    border: examType === type ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                    background: examType === type ? '#EEF2FF' : '#fff',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{cfg.icon}</div>
                  <div className="font-bold text-slate-900 mb-2 truncate">{cfg.name}</div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[0.75rem] text-slate-500 font-medium">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">📋 {cfg.totalQ} Qs</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">⏱ {cfg.durationMin} min</span>
                    </div>
                  </div>
                  {examType === type && (
                    <div className="absolute top-4 right-4 text-indigo-600 animate-in zoom-in">
                      <CheckCircle size={20} fill="currentColor" className="text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Selected Config Summary */}
            <motion.div
              className="edu-card p-6 mb-8 border-2 border-indigo-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}>
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                    <Zap size={20} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900">{config.name}</h3>
                    <p className="text-slate-500 text-sm font-medium">Read the instructions carefully before starting.</p>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Questions', value: config.totalQ, icon: '📋', color: 'bg-indigo-50 text-indigo-600' },
                  { label: 'Duration', value: `${config.durationMin}m`, icon: '⏱️', color: 'bg-teal-50 text-teal-600' },
                  { label: 'Max Score', value: config.totalQ * config.correctMarks, icon: '🎯', color: 'bg-violet-50 text-violet-600' },
                ].map(item => (
                  <div key={item.label} className={`text-center p-4 rounded-2xl ${item.color}`}>
                    <div className="font-black text-lg">{item.value}</div>
                    <div className="text-[0.65rem] font-bold uppercase tracking-wider opacity-70 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest mb-2">Subject Coverage</div>
                <div className="flex flex-wrap gap-2">
                  {config.subjects.map(s => {
                    const subj = subjects.find(sub => sub.id === s);
                    return subj ? (
                      <span key={s} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600">
                        {subj.icon} {subj.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-xs leading-relaxed">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <p className="font-medium">
                   <strong>Negative Marking:</strong> -{config.negativeMarking} marks will be deducted for every incorrect answer. Leave questions unattempted if unsure.
                </p>
              </div>
            </motion.div>

            <motion.button
              onClick={startExam}
              className="w-full edu-btn-primary py-4 rounded-2xl shadow-xl shadow-indigo-600/20 text-md font-black flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}>
              Ready? Start Exam 🚀
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ===== RESULTS SCREEN =====
  if (status === 'finished' && result) {
    const grade = result.percentage >= 90 ? 'A+' : result.percentage >= 75 ? 'A' : result.percentage >= 60 ? 'B' : result.percentage >= 45 ? 'C' : 'D';
    const gradeColor = result.percentage >= 75 ? 'text-emerald-600' : result.percentage >= 45 ? 'text-amber-600' : 'text-rose-600';
    const gradeBg = result.percentage >= 75 ? 'bg-emerald-50' : result.percentage >= 45 ? 'bg-amber-50' : 'bg-rose-50';

    return (
      <div className="flex flex-col items-center justify-center py-6 w-full animate-in zoom-in duration-500">
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>
          
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{result.percentage >= 70 ? '🏆' : result.percentage >= 45 ? '📊' : '💪'}</div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Exam Results</h1>
            <p className="text-slate-500 font-bold">{config.name} Complete</p>
          </div>

          <div className="edu-card p-8 mb-6 border-2 border-slate-50 shadow-2xl shadow-slate-200/50">
            <div className="flex flex-col md:flex-row items-center gap-10">
               {/* Score Circle */}
               <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                    <circle cx="60" cy="60" r="54" fill="none"
                      stroke="currentColor" strokeWidth="12"
                      strokeDasharray={`${(result.percentage / 100) * 339} 339`}
                      strokeLinecap="round"
                      className={`${gradeColor} transition-all duration-1000`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-4xl font-black ${gradeColor}`}>{grade}</div>
                    <div className="text-sm font-black text-slate-900">{result.percentage}%</div>
                  </div>
               </div>

               {/* Stats Grid */}
               <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                  {[
                    { label: 'Raw Score', value: `${result.rawScore}/${result.maxScore}`, color: 'bg-indigo-50 text-indigo-700', icon: '💎' },
                    { label: 'Accuracy', value: `${result.correct + result.wrong > 0 ? Math.round((result.correct / (result.correct + result.wrong)) * 100) : 0}%`, color: 'bg-teal-50 text-teal-700', icon: '🎯' },
                    { label: 'Correct', value: result.correct, color: 'bg-emerald-50 text-emerald-700', icon: '✅' },
                    { label: 'Attempts', value: result.correct + result.wrong, color: 'bg-slate-50 text-slate-700', icon: '📝' },
                  ].map(stat => (
                    <div key={stat.label} className={`p-4 rounded-2xl ${stat.color} flex flex-col items-center justify-center`}>
                       <span className="text-xl mb-1">{stat.icon}</span>
                       <span className="font-black text-lg">{stat.value}</span>
                       <span className="text-[0.65rem] font-bold uppercase tracking-wider opacity-60 mt-1">{stat.label}</span>
                    </div>
                  ))}
               </div>
            </div>

            {result.xpEarned > 0 && (
              <motion.div
                className="mt-8 flex justify-center gap-8 py-4 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/30"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}>
                <div className="flex items-center gap-2">
                  <Zap size={20} fill="currentColor" />
                  <span className="text-xl font-black">+{result.xpEarned} XP</span>
                </div>
                <div className="flex items-center gap-2 border-l border-white/20 pl-8">
                  <span className="text-xl">🪙</span>
                  <span className="text-xl font-black">+{result.coinsEarned} Coins</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Detailed Question Review */}
          <div className="edu-card p-6 mb-6">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                   <BarChart2 size={16} className="text-indigo-600" /> Performance Analysis
                </h3>
             </div>
             <div className="flex flex-wrap gap-2">
                {examQuestions.map((q, i) => {
                  const ans = answers[i];
                  const isCorrect = ans === q.correctAnswer.toString();
                  return (
                    <div key={i} className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                      !ans ? 'bg-slate-100 text-slate-400 border border-slate-200' :
                      isCorrect ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      'bg-rose-100 text-rose-700 border border-rose-200'
                    }`} title={!ans ? 'Unattempted' : isCorrect ? 'Correct' : 'Incorrect'}>
                      {i + 1}
                    </div>
                  );
                })}
             </div>
          </div>

          <div className="flex gap-4">
            <button
               onClick={() => setStatus('setup')}
               className="flex-1 py-4 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
               New Exam
            </button>
            <button
               onClick={startExam}
               className="flex-3 edu-btn-primary py-4 px-10 rounded-2xl shadow-lg shadow-indigo-600/20 font-black">
               🔄 Try Another Mock
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===== RUNNING EXAM =====
  const currentQ = examQuestions[currentIdx];
  if (!currentQ) return null;

  const getQuestionStatus = (i: number) => {
    if (markedForReview[i]) return 'review';
    if (answers[i]) return 'answered';
    return 'unattempted';
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 w-full max-w-[1400px] mx-auto">
      {/* Immersive Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-50 bg-white/80 py-4 backdrop-blur-md rounded-2xl border border-slate-100 px-6 shadow-sm">
        <div className="flex items-center gap-4">
            <button
              onClick={() => {
                 if (confirm('Are you sure you want to end this exam? Progress will not be saved.')) {
                    setStatus('setup');
                 }
              }}
              className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
            >
              <LogOut size={20} />
            </button>
            <div>
               <h2 className="text-sm font-black text-slate-900 leading-tight">{config.name}</h2>
               <div className="flex items-center gap-2 mt-0.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Exam Mode</span>
               </div>
            </div>
        </div>

        {/* Timer UI */}
        <div className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl font-black text-lg transition-all border-2 ${
           timerPct > 0.5 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
           timerPct > 0.25 ? 'bg-amber-50 border-amber-100 text-amber-600' :
           'bg-rose-50 border-rose-100 text-rose-600 animate-pulse'
        }`}>
           <Clock size={20} />
           <span className="font-mono tracking-wider">{formatTime(timeLeft)}</span>
        </div>

        <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-500">
               {attemptedCount}/{examQuestions.length} answered
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Exam Area */}
        <div className="flex-1 flex flex-col gap-6 w-full">
           <AnimatePresence mode="wait">
              <motion.div
                key={currentIdx}
                className="edu-card p-8 min-h-[400px] relative overflow-hidden"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 opacity-10 rounded-bl-[100px] -mr-10 -mt-10" />

                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <span className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                         {currentIdx + 1}
                      </span>
                      <div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Question</div>
                         <div className="text-xs font-bold text-indigo-600 mt-1">Difficulty: {currentQ.difficulty === 1 ? 'Beginner' : currentQ.difficulty === 2 ? 'Intermediate' : 'Expert'}</div>
                      </div>
                   </div>

                   <button
                     onClick={toggleReview}
                     className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                       markedForReview[currentIdx] ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                     }`}>
                     <Flag size={14} fill={markedForReview[currentIdx] ? 'currentColor' : 'none'} />
                     {markedForReview[currentIdx] ? 'Marked for Review' : 'Flag Question'}
                   </button>
                </div>

                <div className="mb-10 text-slate-900 font-bold text-lg leading-relaxed">
                   {currentQ.question}
                </div>

                <div className="grid grid-cols-1 gap-4">
                   {currentQ.options?.map((option, i) => {
                     const isSelected = answers[currentIdx] === option;
                     return (
                       <motion.button
                         key={i}
                         onClick={() => selectAnswer(option)}
                         className={`w-full p-5 rounded-2xl text-left border-2 transition-all group flex items-center gap-4 ${
                           isSelected 
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-lg shadow-indigo-600/5' 
                            : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                         }`}
                         whileHover={{ x: 5 }}
                         whileTap={{ scale: 0.99 }}>
                         <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                         }`}>
                           {String.fromCharCode(65 + i)}
                         </div>
                         <span className="font-bold flex-1">{option}</span>
                         {isSelected && (
                            <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center animate-in zoom-in">
                               <CheckCircle size={14} strokeWidth={3} />
                            </div>
                         )}
                       </motion.button>
                     );
                   })}
                </div>
              </motion.div>
           </AnimatePresence>

           {/* Navigation Controls */}
           <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-[32px] border border-slate-100">
              <button
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-white hover:text-slate-900 transition-all disabled:opacity-30 disabled:hover:bg-transparent">
                <ArrowLeft size={18} /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                  {currentIdx < examQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx(currentIdx + 1)}
                      className="px-10 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2">
                       Next Question <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={() => finishExam(answers, examQuestions)}
                      className="px-10 py-3 rounded-2xl bg-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all">
                       🚀 Complete & Submit
                    </button>
                  )}
              </div>
           </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-full lg:w-80 space-y-6 lg:sticky lg:top-28">
           <div className="edu-card p-6 border-2 border-slate-50">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Question Palette</h3>
                 <BarChart2 size={16} className="text-slate-300" />
              </div>

              <div className="grid grid-cols-5 gap-2 mb-6">
                 {examQuestions.map((_, i) => {
                    const st = getQuestionStatus(i);
                    const isActive = i === currentIdx;
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentIdx(i)}
                        className={`aspect-square rounded-xl text-xs font-black transition-all flex items-center justify-center border-2 ${
                           isActive ? 'border-indigo-600 scale-110 shadow-lg shadow-indigo-600/10' : 'border-transparent'
                        } ${
                           st === 'answered' ? 'bg-indigo-600 text-white' :
                           st === 'review' ? 'bg-amber-100 text-amber-600 border-amber-200' :
                           'bg-slate-50 text-slate-400 hover:bg-slate-100'
                        }`}>
                        {i + 1}
                      </button>
                    );
                 })}
              </div>

              {/* Legend */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                  {[
                    { label: 'Answered', color: 'bg-indigo-600', count: answers.filter(a => a !== null).length },
                    { label: 'For Review', color: 'bg-amber-400', count: reviewCount },
                    { label: 'Remaining', color: 'bg-slate-200', count: examQuestions.length - attemptedCount }
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                       <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${item.color}`} />
                          <span className="text-slate-400">{item.label}</span>
                       </div>
                       <span className="text-slate-900">{item.count}</span>
                    </div>
                  ))}
              </div>

              <button
                onClick={() => finishExam(answers, examQuestions)}
                className="w-full mt-6 py-4 rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold text-sm hover:bg-indigo-100 transition-all border border-indigo-100">
                End Exam Mode
              </button>
           </div>

           {/* Quick Tips */}
           <div className="p-5 rounded-[32px] bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl">
              <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                 <Zap size={16} className="text-indigo-400" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-1">Focus Tip</h4>
              <p className="text-[11px] text-indigo-200/70 leading-relaxed font-medium">
                 Don't spend more than 2 minutes on a single question. Flag it and move forward.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};