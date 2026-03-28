import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  GraduationCap, BookOpen, Brain, Trophy, Star, ArrowRight,
  Users, TrendingUp, CheckCircle, ChevronRight, Zap, Target,
  BarChart2, MessageSquare, Menu, X, Award
} from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    color: '#4F46E5',
    bg: 'rgba(79,70,229,0.08)',
    title: 'CBSE/NCERT Aligned',
    desc: 'Complete syllabus coverage for Class 10 & 12 with chapter-wise practice questions.',
  },
  {
    icon: Brain,
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.08)',
    title: 'AI Study Assistant',
    desc: 'Get instant explanations, step-by-step solutions, and personalized study tips.',
  },
  {
    icon: BarChart2,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    title: 'Smart Analytics',
    desc: 'Track accuracy, identify weak topics, and get predicted exam scores.',
  },
  {
    icon: Trophy,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    title: 'Gamified Learning',
    desc: 'Earn XP, coins, and badges as you complete chapters and ace quizzes.',
  },
  {
    icon: Target,
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.08)',
    title: 'Adaptive Difficulty',
    desc: 'AI adjusts question difficulty based on your performance for optimal growth.',
  },
  {
    icon: MessageSquare,
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.08)',
    title: 'Mock Exam Mode',
    desc: 'Full-length CBSE/NEET-style tests with timer, analysis, and score prediction.',
  },
];

const subjects = [
  { emoji: '⚡', name: 'Physics', color: '#4F46E5', bg: 'rgba(79,70,229,0.08)', chapters: 8, tag: 'Class 10 & 12' },
  { emoji: '🧪', name: 'Chemistry', color: '#10B981', bg: 'rgba(16,185,129,0.08)', chapters: 7, tag: 'Class 10 & 12' },
  { emoji: '🧬', name: 'Biology', color: '#EF4444', bg: 'rgba(239,68,68,0.08)', chapters: 7, tag: 'Class 10 & 12' },
  { emoji: '📐', name: 'Mathematics', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', chapters: 8, tag: 'Class 10 & 12' },
];

const stats = [
  { value: '50,000+', label: 'Active Students', icon: Users, color: '#4F46E5' },
  { value: '10,000+', label: 'Practice Questions', icon: BookOpen, color: '#7C3AED' },
  { value: '95%', label: 'Success Rate', icon: TrendingUp, color: '#10B981' },
  { value: '4.9/5', label: 'Student Rating', icon: Star, color: '#F59E0B' },
];

const steps = [
  { num: '01', title: 'Create Your Account', desc: 'Sign up free and set your class (10th or 12th) and exam target.', color: '#4F46E5' },
  { num: '02', title: 'Choose a Subject', desc: 'Pick from Physics, Chemistry, Biology, or Mathematics.', color: '#7C3AED' },
  { num: '03', title: 'Start Learning', desc: 'Answer chapter-wise questions and earn XP with every correct answer.', color: '#10B981' },
  { num: '04', title: 'Track & Improve', desc: 'Review analytics, take mock tests, and ace your board exams.', color: '#F59E0B' },
];

const testimonials = [
  { name: 'Priya Sharma', class: 'Class 12, NEET Aspirant', avatar: '👩‍🎓', rating: 5, text: 'EduQuest helped me improve my Biology accuracy from 65% to 92% in just 3 months. The AI explanations are incredibly clear.' },
  { name: 'Arjun Patel', class: 'Class 10, CBSE Boards', avatar: '🧑‍💻', rating: 5, text: 'The gamified approach keeps me motivated every day. I actually look forward to studying now!' },
  { name: 'Sneha Iyer', class: 'Class 12, JEE Prep', avatar: '🦊', rating: 5, text: 'Best platform for NCERT practice. The mock exams feel exactly like the real thing.' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div style={{ background: '#fff', color: '#1E293B', fontFamily: 'inherit' }}>

      {/* Top Navigation */}
      <nav style={{
        background: '#fff',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
              <GraduationCap size={20} color="white" />
            </div>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1E293B' }}>EduQuest</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Subjects', 'How It Works', 'Testimonials'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                className="group relative py-1 text-[0.9rem] font-semibold transition-colors duration-200 hover:text-indigo-600"
                style={{ color: '#475569', textDecoration: 'none' }}>
                {link}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/auth')}
              style={{ color: '#4F46E5', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
              Sign In
            </button>
            <motion.button
              onClick={() => navigate('/auth?mode=signup')}
              className="edu-btn-primary"
              style={{ padding: '9px 20px', fontSize: '0.9rem' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}>
              Get Started Free
            </motion.button>
          </div>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setNavOpen(!navOpen)} style={{ color: '#64748B' }}>
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {navOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid #E2E8F0', padding: '16px 24px' }} className="md:hidden space-y-3">
            <button onClick={() => navigate('/auth')} className="w-full edu-btn-outline" style={{ padding: '10px', fontSize: '0.9rem' }}>
              Sign In
            </button>
            <button onClick={() => navigate('/auth?mode=signup')} className="w-full edu-btn-primary" style={{ padding: '10px', fontSize: '0.9rem' }}>
              Get Started Free
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{ background: 'linear-gradient(135deg, #F0F4FF 0%, #EEF2FF 50%, #F5F3FF 100%)', padding: '40px 24px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}>
              <div className="edu-badge edu-badge-blue inline-flex mb-4" style={{ fontSize: '0.8rem' }}>
                🚀 AI-Powered Gamified Learning Platform
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.15, color: '#0F172A', marginBottom: 20 }}>
                Master Your CBSE Exams with{' '}
                <span className="edu-text-gradient">Gamified AI</span> Learning
              </h1>
              <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: 32 }}>
                Master CBSE/NCERT subjects with AI-powered practice, gamified challenges,
                and personalized analytics. Used by 50,000+ students across India.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <motion.button
                  onClick={() => navigate('/auth?mode=signup')}
                  className="edu-btn-primary flex items-center justify-center gap-2"
                  style={{ padding: '14px 28px', fontSize: '1rem' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}>
                  Start Learning Free <ArrowRight size={18} />
                </motion.button>
                <motion.button
                  onClick={() => navigate('/auth')}
                  className="edu-btn-outline flex items-center justify-center gap-2"
                  style={{ padding: '14px 28px', fontSize: '1rem' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}>
                  Sign In
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-4">
                {['✓ Free to start', '✓ NCERT aligned', '✓ AI-powered', '✓ No credit card'].map(tag => (
                  <span key={tag} style={{ color: '#64748B', fontSize: '0.85rem' }}>{tag}</span>
                ))}
              </div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}>
              <div className="relative">
                {/* Main dashboard preview card */}
                <div className="edu-card p-6" style={{ boxShadow: '0 20px 60px rgba(79,70,229,0.15)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A' }}>My Learning Progress</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>This week</div>
                    </div>
                    <div className="edu-badge edu-badge-green">↑ +12% this week</div>
                  </div>
                  {/* Mini subject bars */}
                  {[
                    { name: 'Physics', pct: 78, color: '#4F46E5' },
                    { name: 'Chemistry', pct: 65, color: '#10B981' },
                    { name: 'Biology', pct: 89, color: '#EF4444' },
                    { name: 'Mathematics', pct: 54, color: '#F59E0B' },
                  ].map(s => (
                    <div key={s.name} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: '#1E293B', fontWeight: 500 }}>{s.name}</span>
                        <span style={{ color: s.color, fontWeight: 600 }}>{s.pct}%</span>
                      </div>
                      <div className="edu-progress-bar" style={{ height: 6 }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: s.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${s.pct}%` }}
                          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                        />
                      </div>
                    </div>
                  ))}
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid #E2E8F0' }}>
                    {[
                      { label: 'XP Earned', value: '2,450', icon: '⚡' },
                      { label: 'Streak', value: '14 days', icon: '🔥' },
                      { label: 'Accuracy', value: '87%', icon: '🎯' },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <div style={{ fontSize: '1.1rem' }}>{s.icon}</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>{s.value}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating badge */}
                <motion.div
                  className="absolute -top-4 -right-4 edu-card px-3 py-2 flex items-center gap-2"
                  style={{ boxShadow: '0 8px 24px rgba(245,158,11,0.2)' }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                  <span style={{ fontSize: '1.2rem' }}>🏆</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F172A' }}>+250 XP</div>
                    <div style={{ fontSize: '0.65rem', color: '#94A3B8' }}>Chapter Complete!</div>
                  </div>
                </motion.div>

                {/* AI chat bubble */}
                <motion.div
                  className="absolute -bottom-4 -left-4 edu-card px-3 py-2"
                  style={{ maxWidth: 200, boxShadow: '0 8px 24px rgba(79,70,229,0.15)' }}
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                      <Brain size={12} color="white" />
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#64748B', lineHeight: 1.4 }}>
                      "Newton's 2nd Law: F = ma. Let me explain this step by step..."
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ background: '#fff', padding: '40px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${stat.color}15` }}>
                  <stat.icon size={22} color={stat.color} />
                </div>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0F172A' }}>{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: 4 }}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" style={{ padding: '40px 24px 30px', background: '#F8FAFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <div className="edu-badge edu-badge-blue inline-flex mb-3">Core Subjects</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
              Complete CBSE/NCERT Coverage
            </h2>
            <p style={{ color: '#64748B', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
              Master all four core subjects with structured chapter-wise learning and practice questions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {subjects.map((subj, i) => (
              <motion.div
                key={subj.name}
                className="edu-card-hover p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate('/auth?mode=signup')}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ background: subj.bg }}>
                  {subj.emoji}
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', marginBottom: 6 }}>{subj.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: 12 }}>{subj.chapters} Chapters</div>
                <div className="edu-badge" style={{ background: subj.bg, color: subj.color }}>{subj.tag}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '30px 24px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <div className="edu-badge edu-badge-purple inline-flex mb-3">Platform Features</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
              Everything You Need to Excel
            </h2>
            <p style={{ color: '#64748B', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
              From AI-powered tutoring to gamified quizzes, we have all the tools to help you succeed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                className="edu-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3 }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: feat.bg }}>
                  <feat.icon size={22} color={feat.color} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: 8 }}>{feat.title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.65 }}>{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '30px 24px 40px', background: '#F8FAFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <div className="edu-badge edu-badge-green inline-flex mb-3">Simple Process</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
              How EduQuest Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${step.color}15` }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: step.color }}>{step.num}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: 1.6 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: '40px 24px 30px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <div className="edu-badge edu-badge-gold inline-flex mb-3">Student Stories</div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 800, color: '#0F172A', marginBottom: 12 }}>
              What Students Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="edu-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={15} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: 'rgba(79,70,229,0.08)' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{t.class}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '30px 24px 50px', background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 50%, #7C3AED 100%)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}>
            <Award size={48} color="rgba(255,255,255,0.8)" style={{ margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
              Ready to Ace Your Exams?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 32 }}>
              Join 50,000+ students using EduQuest to master CBSE/NCERT subjects and achieve top scores.
              Start your free learning journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={() => navigate('/auth?mode=signup')}
                style={{ background: '#fff', color: '#4F46E5', border: 'none', borderRadius: 10, padding: '14px 32px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}
                whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
                whileTap={{ scale: 0.97 }}>
                Get Started — It's Free
              </motion.button>
              <motion.button
                onClick={() => navigate('/auth')}
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 10, padding: '14px 32px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
                whileHover={{ background: 'rgba(255,255,255,0.25)' }}
                whileTap={{ scale: 0.97 }}>
                Already a member? Sign In
              </motion.button>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: 20 }}>
              No credit card required • Free forever for basic access
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0F172A', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
              <GraduationCap size={18} color="white" />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>EduQuest</span>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
            Empowering CBSE students to achieve their academic dreams. © 2026 EduQuest. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(link => (
              <a key={link} href="#" style={{ color: '#64748B', fontSize: '0.82rem', textDecoration: 'none' }}
                className="hover:text-white transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
