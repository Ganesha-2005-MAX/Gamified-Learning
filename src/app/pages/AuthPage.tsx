import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, ArrowLeft, CheckCircle, Star } from 'lucide-react';

const avatarOptions = ['🧑‍🎓', '👩‍🎓', '🧑‍💻', '👩‍💻', '🦸', '🦹', '🧙', '🦊', '🐺', '🦁', '📚', '⭐'];

const benefits = [
  'Chapter-wise NCERT practice questions',
  'AI Study Assistant with instant answers',
  'Real-time progress tracking & analytics',
  'Gamified learning with XP and badges',
  'Full mock exams for CBSE/NEET/JEE',
];

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get('mode') === 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('🧑‍🎓');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    class: '10' as '10' | '12',
    targetExam: 'Boards' as 'Boards' | 'NEET' | 'CUET' | 'JEE',
  });

  const { signup, login, state } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.user) navigate('/dashboard');
  }, [state.user, navigate]);

  const handleLogin = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find((u: any) => u.email === formData.email && u.password === formData.password);
        if (found) {
          const { password: _, ...userProfile } = found;
          login(userProfile);
          navigate('/dashboard');
        } else {
          setError('Invalid email or password. Try demo@test.com / demo123');
        }
      } catch {
        setError('Login failed. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  const handleSignup = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      const success = signup({
        name: formData.name,
        email: formData.email,
        class: formData.class,
        targetExam: formData.targetExam,
        avatar: selectedAvatar,
      }, formData.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Email already registered. Please sign in.');
      }
      setLoading(false);
    }, 800);
  };

  const handleDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const demoUser = {
        id: 'demo-user',
        name: 'Demo Student',
        email: 'demo@test.com',
        class: '12' as '12',
        targetExam: 'NEET' as 'NEET',
        avatar: '🧑‍🎓',
        joinedDate: new Date().toISOString(),
      };
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (!users.find((u: any) => u.email === 'demo@test.com')) {
        users.push({ ...demoUser, password: 'demo123' });
        localStorage.setItem('users', JSON.stringify(users));
      }
      login(demoUser);
      navigate('/dashboard');
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F0F4FF' }}>
      {/* Left Panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-10"
        style={{
          width: 420,
          flexShrink: 0,
          background: 'linear-gradient(180deg, #4338CA 0%, #6D28D9 60%, #7C3AED 100%)',
        }}>
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <GraduationCap size={22} color="white" />
            </div>
            <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>EduQuest</span>
          </div>

          <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.3, marginBottom: 16 }}>
            Start your learning journey today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 32 }}>
            Master CBSE/NCERT subjects with AI-powered practice, gamified challenges, and personalized analytics.
          </p>

          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(255,255,255,0.2)' }}>
                  <CheckCircle size={12} color="white" />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.08)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 20, 
          padding: 24,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="#FBBF24" color="#FBBF24" />)}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 16 }}>
            "EduQuest helped me improve my score from <span style={{ color: '#FCD34D', fontWeight: 700 }}>72% to 94%</span> in just 4 months. The AI explanations are incredibly helpful!"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.1)' }}>
              👩‍🎓
            </div>
            <div>
              <div style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 700 }}>Priya Sharma</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>Class 12, NEET 2026</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div style={{ width: '100%', maxWidth: 440 }}>
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-8 transition-colors"
            style={{ color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
            whileHover={{ x: -3 }}>
            <ArrowLeft size={16} /> Back to Home
          </motion.button>

          <motion.div
            className="edu-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>

            {/* Header */}
            <div className="mb-8">
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                {isSignup ? 'Create your account' : 'Welcome back'}
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
                {isSignup ? 'Join thousands of CBSE students on EduQuest' : 'Sign in to continue your learning journey'}
              </p>
            </div>

            {/* Tab Toggle */}
            <div
              className="flex rounded-xl p-1 mb-6"
              style={{ background: '#F1F5F9' }}>
              {['Sign In', 'Sign Up'].map((tab, i) => (
                <motion.button
                  key={tab}
                  onClick={() => { setIsSignup(i === 1); setError(''); }}
                  className="flex-1 py-2.5 rounded-lg text-sm transition-all"
                  style={{
                    background: (i === 1 ? isSignup : !isSignup) ? '#fff' : 'transparent',
                    color: (i === 1 ? isSignup : !isSignup) ? '#1E293B' : '#64748B',
                    fontWeight: (i === 1 ? isSignup : !isSignup) ? 600 : 400,
                    boxShadow: (i === 1 ? isSignup : !isSignup) ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  whileTap={{ scale: 0.98 }}>
                  {tab}
                </motion.button>
              ))}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {isSignup && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4">
                    {/* Name */}
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        className="edu-input"
                        style={{ paddingLeft: 40 }}
                      />
                    </div>

                    {/* Class + Target */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Class</label>
                        <div className="flex gap-2">
                          {['10', '12'].map(cls => (
                            <button
                              key={cls}
                              type="button"
                              onClick={() => setFormData(p => ({ ...p, class: cls as '10' | '12' }))}
                              style={{
                                flex: 1,
                                padding: '9px 0',
                                borderRadius: 10,
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                background: formData.class === cls ? '#4F46E5' : '#F1F5F9',
                                color: formData.class === cls ? '#fff' : '#64748B',
                                border: 'none',
                              }}>
                              {cls}th
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Target Exam</label>
                        <select
                          value={formData.targetExam}
                          onChange={e => setFormData(p => ({ ...p, targetExam: e.target.value as any }))}
                          className="edu-input"
                          style={{ color: '#1E293B' }}>
                          <option value="Boards">Boards</option>
                          <option value="NEET">NEET</option>
                          <option value="JEE">JEE</option>
                          <option value="CUET">CUET</option>
                        </select>
                      </div>
                    </div>

                    {/* Avatar */}
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Choose Avatar</label>
                      <div className="grid grid-cols-6 gap-2">
                        {avatarOptions.map(av => (
                          <button
                            key={av}
                            type="button"
                            onClick={() => setSelectedAvatar(av)}
                            style={{
                              fontSize: '1.3rem',
                              padding: '6px 0',
                              borderRadius: 10,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              background: selectedAvatar === av ? 'rgba(79,70,229,0.1)' : '#F1F5F9',
                              border: selectedAvatar === av ? '1.5px solid #4F46E5' : '1.5px solid transparent',
                            }}>
                            {av}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="edu-input"
                  style={{ paddingLeft: 40 }}
                  onKeyDown={e => e.key === 'Enter' && (isSignup ? handleSignup() : handleLogin())}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#94A3B8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="edu-input"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                  onKeyDown={e => e.key === 'Enter' && (isSignup ? handleSignup() : handleLogin())}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontSize: '0.85rem' }}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                onClick={isSignup ? handleSignup : handleLogin}
                className="w-full edu-btn-primary flex items-center justify-center gap-2"
                style={{ padding: '13px', fontSize: '0.95rem' }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}>
                {loading ? (
                  <motion.div
                    className="w-5 h-5 border-2 rounded-full border-white"
                    style={{ borderTopColor: 'transparent' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <>{isSignup ? 'Create Account' : 'Sign In'}</>
                )}
              </motion.button>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px" style={{ background: '#E2E8F0' }} />
                </div>
                <div className="relative text-center">
                  <span style={{ padding: '0 12px', fontSize: '0.8rem', color: '#94A3B8', background: '#fff' }}>or</span>
                </div>
              </div>

              <motion.button
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2"
                style={{
                  background: '#F8FAFF',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: 10,
                  padding: '12px',
                  color: '#4F46E5',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                whileHover={{ background: 'rgba(79,70,229,0.05)' }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}>
                <span>🎓</span> Try Demo Account
              </motion.button>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94A3B8', marginTop: 4 }}>
                Demo: demo@test.com / demo123
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
