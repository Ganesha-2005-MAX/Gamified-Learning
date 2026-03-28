import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { Send, Bot, User, Zap, Key, X, ChevronDown, BookOpen, Lightbulb, HelpCircle, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { icon: '⚡', text: "Explain Newton's Laws simply", subject: 'physics' },
  { icon: '🧪', text: "What is a chemical equation?", subject: 'chemistry' },
  { icon: '🧬', text: "How does photosynthesis work?", subject: 'biology' },
  { icon: '📐', text: "Explain quadratic equations", subject: 'mathematics' },
  { icon: '🎯', text: "Tips for NEET exam", subject: 'exam' },
  { icon: '🔥', text: "Important topics for boards", subject: 'general' },
];

// Smart AI mock responses
const getMockResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();

  if (msg.includes('newton') || msg.includes('force') || msg.includes('motion')) {
    return `## Newton's Laws of Motion 🔭

**1st Law (Inertia):** An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.
> 🧠 *Memory Trick:* "Lazy objects don't like change!"

**2nd Law (F = ma):** Force equals mass times acceleration.
> 📌 If F doubles → a doubles (with same mass)
> 📌 If mass doubles → a halves (with same force)

**3rd Law (Action-Reaction):** For every action, there is an equal and opposite reaction.
> 🚀 *Example:* Rocket expels gas backward → moves forward

**CBSE Exam Tips:**
• Always include units in numerical answers
• Draw free body diagrams for complex problems
• Remember: Action & reaction act on **different** objects

Want me to solve a numerical problem using these laws? 💪`;
  }

  if (msg.includes('photosynthesis') || msg.includes('chloroplast') || msg.includes('plant')) {
    return `## Photosynthesis 🌱

**Equation:**
6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂
(in presence of sunlight and chlorophyll)

**Where it happens:** Chloroplasts (contains **chlorophyll** pigment)

**Two Stages:**
1. **Light Reaction** (thylakoids): Uses sunlight → produces ATP + NADPH
2. **Dark Reaction / Calvin Cycle** (stroma): Uses CO₂ → produces glucose

**Key Points for NEET/Boards:**
• Chlorophyll absorbs **red and blue** light, reflects **green**
• CO₂ enters through **stomata**
• Guard cells control stomata opening/closing
• Oxygen is a **by-product** — released through stomata

🧠 **Mnemonic:** "Can Happily Grow" = CO₂ + H₂O → Glucose

Shall I explain any part in more detail? 🔬`;
  }

  if (msg.includes('acid') || msg.includes('base') || msg.includes('ph') || msg.includes('chemistry')) {
    return `## Acids, Bases & pH Scale 🧪

**Acids:** Release H⁺ ions in water
• Examples: HCl, H₂SO₄, CH₃COOH (acetic acid in vinegar)

**Bases:** Release OH⁻ ions in water  
• Examples: NaOH, Ca(OH)₂, NH₄OH

**pH Scale:**
\`\`\`
0 ←——— ACID ———→ 7 ←——— BASE ———→ 14
\`\`\`
• pH < 7 → Acidic
• pH = 7 → Neutral (pure water)
• pH > 7 → Basic/Alkaline

**Neutralization:** Acid + Base → Salt + Water
Example: HCl + NaOH → NaCl + H₂O

**Indicators:**
| Indicator | Acid | Base |
|-----------|------|------|
| Litmus | Red | Blue |
| Methyl Orange | Red | Yellow |
| Phenolphthalein | Colorless | Pink |

💡 **Exam Trick:** Strong acids/bases have lower/higher pH extremes. Weak acids like acetic acid have pH around 3-4.`;
  }

  if (msg.includes('quadratic') || msg.includes('polynomial') || msg.includes('equation')) {
    return `## Quadratic Equations 📐

**Standard Form:** ax² + bx + c = 0 (where a ≠ 0)

**Quadratic Formula:**
$$x = \\frac{-b \\pm \\sqrt{b² - 4ac}}{2a}$$

**Discriminant (D = b² - 4ac):**
| Value | Nature of Roots |
|-------|----------------|
| D > 0 | Two distinct real roots |
| D = 0 | Two equal real roots |
| D < 0 | No real roots (complex) |

**Methods to Solve:**
1. **Factorization** (split middle term)
2. **Completing the Square**
3. **Quadratic Formula** (always works!)

**Example:** x² - 5x + 6 = 0
→ (x-2)(x-3) = 0
→ x = 2 or x = 3

🎯 **CBSE Tip:** In exams, first check if D ≥ 0, then use factorization. If it doesn't factor easily, use the formula!

Sum of roots = -b/a | Product of roots = c/a`;
  }

  if (msg.includes('neet') || msg.includes('exam') || msg.includes('tips') || msg.includes('board')) {
    return `## Exam Strategy Guide 🎯

**For NEET:**
• Physics: Focus on Mechanics, Electromagnetism, Modern Physics (40-50% weightage)
• Chemistry: NCERT is BIBLE — read every line
• Biology: Learn diagrams, processes, exceptions

**For CBSE Boards:**
• Last 5 years papers = pattern recognition
• Focus on 3-mark & 5-mark questions (highest scoring)
• Always show **working/steps** — partial marks are awarded

**Daily Study Plan (Recommended):**
| Time | Activity |
|------|----------|
| 6-8 AM | Revision of previous day |
| 9 AM-12 PM | New topics |
| 2-5 PM | Practice questions |
| 7-9 PM | Weak topic focus |

**Last 30 Days Strategy:**
1. Only NCERT + previous year papers
2. Mock tests every 2 days
3. Revise formulas daily
4. Sleep 7-8 hours (brain consolidation!)

📊 **Important:** Accuracy > Speed. Don't guess randomly in NEET (negative marking!)

You've got this! 💪 Which subject should we focus on?`;
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return `Hey there! 👋 I'm **EduBot**, your AI study assistant!

I can help you with:
• 📚 **Explain concepts** from Physics, Chemistry, Biology & Maths
• 🔍 **Step-by-step solutions** to problems
• 💡 **Shortcuts & tricks** for quick solving
• 🎯 **Exam tips** for CBSE Boards, NEET, JEE & CUET
• 📝 **Generate similar practice questions**

What would you like to study today? Ask me anything! 🚀`;
  }

  if (msg.includes('help') || msg.includes('what can you')) {
    return `## What I Can Help You With 🤖

**📚 Concept Explanations**
Ask: "Explain [concept]" or "What is [topic]?"

**🔢 Problem Solving**
Share: "Solve this: [problem]" or "How to solve [type]?"

**💡 Shortcuts & Tricks**
Ask: "Shortcut for [formula/concept]?"

**📝 Practice Questions**
Ask: "Give me 5 questions on [topic]"

**🎯 Exam Strategy**
Ask: "Important topics for NEET/Boards"

**Topics I'm Great At:**
• Physics: Mechanics, Electricity, Optics, Modern Physics
• Chemistry: Reactions, Acids/Bases, Organic, Electrochemistry  
• Biology: Life processes, Genetics, Ecology
• Mathematics: Algebra, Trigonometry, Calculus, Statistics

Type any question to get started! ⚡`;
  }

  if (msg.includes('electricity') || msg.includes('ohm') || msg.includes('current') || msg.includes('resistance')) {
    return `## Electricity Fundamentals ⚡

**Ohm's Law:** V = IR
(Voltage = Current × Resistance)

**Key Formulas:**
| Quantity | Formula | Unit |
|---------|---------|------|
| Current I | Q/t | Ampere (A) |
| Resistance R | ρL/A | Ohm (Ω) |
| Power P | VI = I²R = V²/R | Watt (W) |
| Energy E | P × t | Joule (J) |

**Series Circuit:**
• R_total = R₁ + R₂ + R₃
• Same current through all
• Voltage divides

**Parallel Circuit:**
• 1/R_total = 1/R₁ + 1/R₂ + 1/R₃
• Same voltage across all
• Current divides

**Memory Tricks:**
🔑 "Series = Same Current, Splits Voltage"
🔑 "Parallel = Same Voltage, Splits Current"

💡 **Exam Favorite:** Power quadruples when voltage doubles (P = V²/R)!`;
  }

  if (msg.includes('heredity') || msg.includes('genetics') || msg.includes('dna') || msg.includes('mendel')) {
    return `## Heredity & Genetics 🧬

**Mendel's Laws:**
1. **Law of Dominance**: In a hybrid, one character dominates the other
2. **Law of Segregation**: Alleles separate during gamete formation
3. **Law of Independent Assortment**: Different genes assort independently

**Key Terms:**
• **Genotype**: Genetic makeup (e.g., Tt, TT, tt)
• **Phenotype**: Physical appearance (e.g., Tall, Dwarf)
• **Dominant**: Expressed in hybrid (shown as capital letter)
• **Recessive**: Hidden in hybrid (shown as small letter)

**Monohybrid Cross (Tt × Tt):**
\`\`\`
    T     t
T | TT | Tt |
t | Tt | tt |
\`\`\`
Ratio: 1 TT : 2 Tt : 1 tt = **3:1 phenotype ratio**

**DNA:**
• Double helix structure (Watson & Crick, 1953)
• Bases: A-T and G-C pairs
• Carries genetic information

🎯 **NEET Focus:** Punnett squares, blood group genetics, sex determination`;
  }

  // Default response
  return `That's a great question! 🤔

I understand you're asking about: **"${userMessage.slice(0, 50)}..."**

Here's what I can tell you:

For the best explanation, could you be more specific? For example:
• Which chapter or topic is this from?
• Is this for Physics, Chemistry, Biology, or Maths?
• Are you solving a specific numerical problem?

**Try asking:**
• "Explain [specific concept]"
• "How to solve [type of problem]"
• "What is the formula for [topic]"
• "Give me tips for [subject/exam]"

I'm powered by NCERT curriculum and always ready to help! 💪

> 💡 **Note**: Connect your OpenAI API key (Settings) for advanced AI responses including custom question generation and personalized explanations!`;
};

export const ChatPage: React.FC = () => {
  const { state, setOpenAIKey } = useGame();
  const [activeTab, setActiveTab] = useState<'chat' | 'resources'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: `Hey ${state.user?.name?.split(' ')[0] || 'there'}! 👋 I'm **EduBot**, your AI study companion!\n\nI'm here to help you master Physics, Chemistry, Biology, and Maths for your ${state.user?.targetExam || 'Boards'} exam.\n\nWhat would you like to learn today? 🚀`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(state.openAIKey || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: content.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    const thinkTime = 800 + Math.random() * 1200;

    if (state.openAIKey) {
      // Real OpenAI call
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${state.openAIKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are EduBot, an AI tutor for Class 10 and 12 CBSE/NCERT students in India. Help with Physics, Chemistry, Biology, and Mathematics. Focus on NCERT curriculum. Give clear, concise explanations with examples. Use markdown formatting. Include exam tips when relevant. Target exams: CBSE Boards, NEET, JEE, CUET.`
              },
              ...messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: content.trim() }
            ],
            max_tokens: 600,
            temperature: 0.7,
          }),
        });
        const data = await response.json();
        const aiContent = data.choices?.[0]?.message?.content || getMockResponse(content);
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now().toString() + 'ai', role: 'assistant', content: aiContent, timestamp: new Date() }]);
      } catch (err) {
        setIsTyping(false);
        setMessages(prev => [...prev, { id: Date.now().toString() + 'ai', role: 'assistant', content: getMockResponse(content), timestamp: new Date() }]);
      }
    } else {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now().toString() + 'ai',
          role: 'assistant',
          content: getMockResponse(content),
          timestamp: new Date(),
        }]);
      }, thinkTime);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code style="background:rgba(79,70,229,0.08);padding:1px 6px;border-radius:4px;font-family:monospace;color:#4F46E5;font-size:0.88em">$1</code>')
      .replace(/^## (.*$)/gm, '<h3 style="font-size:1rem;font-weight:700;color:#0F172A;margin-bottom:8px;margin-top:12px">$1</h3>')
      .replace(/^• (.*$)/gm, '<li style="margin-left:12px;margin-bottom:4px;color:#374151">$1</li>')
      .replace(/^> (.*$)/gm, '<blockquote style="border-left:3px solid #4F46E5;padding-left:12px;color:#64748B;margin:8px 0;font-style:italic">$1</blockquote>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200/50">
      {/* API Key Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.4)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowKeyModal(false)}>
            <motion.div
              className="edu-card p-6 w-full max-w-md"
              style={{ border: '1.5px solid rgba(79,70,229,0.2)' }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(79,70,229,0.1)' }}>
                    <Key size={16} color="#4F46E5" />
                  </div>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>OpenAI API Key</span>
                </div>
                <button onClick={() => setShowKeyModal(false)} style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: 16, lineHeight: 1.6 }}>
                Add your OpenAI API key for real AI responses. Without it, smart pre-built responses are used.
              </p>
              <input
                type="password"
                value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                placeholder="sk-..."
                className="edu-input"
                style={{ marginBottom: 16 }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setOpenAIKey(''); setApiKeyInput(''); setShowKeyModal(false); }}
                  style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                  Clear Key
                </button>
                <button
                  onClick={() => { setOpenAIKey(apiKeyInput); setShowKeyModal(false); }}
                  className="edu-btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.875rem' }}>
                  Save Key
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Sliding Tab Bar and Secondary Toolbar */}
      <div className="bg-white border-b border-slate-100 px-6 py-2.5 flex flex-col items-center gap-3">
        <div className="max-w-[400px] w-full flex gap-1.5 rounded-xl p-1 bg-slate-100/80">
          {(['chat', 'resources'] as const).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative flex-1 py-1.5 rounded-lg text-xs transition-colors duration-200"
              style={{
                color: activeTab === tab ? '#4F46E5' : '#64748B',
                fontWeight: activeTab === tab ? 800 : 600,
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
              whileTap={{ scale: 0.96 }}>
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTutorTab"
                  className="absolute inset-0 bg-white shadow-sm rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab === 'chat' ? '💬 Tutor Chat' : '📚 Study Vault'}</span>
            </motion.button>
          ))}
        </div>

        {/* Floating Secondary Toolbox */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages(prev => [prev[0]])}
            style={{ padding: '6px 12px', borderRadius: 8, background: '#F8FAFF', border: '1px solid #E2E8F0', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 600 }}
            title="Clear Chat History">
            <RefreshCw size={14} /> Clear Chat
          </button>
          <button
            onClick={() => setShowKeyModal(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              padding: '6px 14px', 
              borderRadius: 8, 
              background: state.openAIKey ? 'rgba(16,185,129,0.06)' : '#F8FAFF', 
              border: `1px solid ${state.openAIKey ? 'rgba(16,185,129,0.2)' : '#E2E8F0'}`, 
              color: state.openAIKey ? '#10B981' : '#64748B', 
              fontWeight: 700, 
              fontSize: '0.75rem', 
              cursor: 'pointer' 
            }}>
            <Key size={12} /> {state.openAIKey ? 'API Active' : 'Configure AI'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
      <AnimatePresence mode="wait">
        {activeTab === 'chat' ? (
          <motion.div 
            key="chat-view"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto edu-scrollbar" style={{ padding: '20px 24px', maxWidth: 900, width: '100%', margin: '0 auto' }}>
              {/* Quick Prompts (show only if few messages) */}
              {messages.length <= 1 && (
                <div className="mb-6">
                  <div style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Quick Questions
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <motion.button
                        key={i}
                        onClick={() => sendMessage(prompt.text)}
                        className="edu-card-hover p-3 text-left bg-white"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{prompt.icon}</div>
                        <div style={{ fontSize: '0.78rem', color: '#374151', lineHeight: 1.4, fontWeight: 600 }}>{prompt.text}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="space-y-4">
                {messages.map(message => (
                  <motion.div
                    key={message.id}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}>
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md shadow-indigo-500/10"
                        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                        <Bot size={15} color="white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-4 py-3 shadow-sm ${message.role === 'user' ? 'chat-bubble-user bg-indigo-600 text-white rounded-t-2xl rounded-bl-2xl' : 'chat-bubble-ai bg-white text-slate-700 rounded-t-2xl rounded-br-2xl'}`}
                      style={{ fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 500 }}
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 text-lg shadow-sm bg-white"
                        style={{ flexShrink: 0 }}>
                        {state.user?.avatar || '🎓'}
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div className="flex gap-3 justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/10"
                      style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                      <Bot size={15} color="white" />
                    </div>
                    <div className="bg-white px-4 py-3 flex gap-1.5 items-center rounded-t-2xl rounded-br-2xl shadow-sm">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#4F46E5' }}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div style={{ background: '#fff', borderTop: '1px solid #E2E8F0', padding: '16px 24px' }}>
              <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <div className="flex gap-3 items-end">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything about Physics, Chemistry, Biology or Maths..."
                    rows={1}
                    className="edu-input flex-1 edu-scrollbar bg-slate-50 focus:bg-white border-transparent focus:border-indigo-200"
                    style={{ resize: 'none', minHeight: 48, maxHeight: 120, lineHeight: 1.6, paddingTop: 12, paddingBottom: 12, fontWeight: 500 }}
                    onInput={e => {
                      const t = e.target as HTMLTextAreaElement;
                      t.style.height = 'auto';
                      t.style.height = Math.min(t.scrollHeight, 120) + 'px';
                    }}
                  />
                  <motion.button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isTyping}
                    className="edu-btn-primary flex items-center justify-center shadow-lg shadow-indigo-500/20"
                    style={{ padding: '0 24px', height: 48, opacity: (!input.trim() || isTyping) ? 0.5 : 1, flexShrink: 0 }}
                    whileHover={input.trim() ? { scale: 1.03, y: -2 } : {}}
                    whileTap={input.trim() ? { scale: 0.97 } : {}}>
                    <Send size={18} />
                  </motion.button>
                </div>
                <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 10, textAlign: 'center', fontWeight: 600 }}>
                  Press Enter to send · Shift+Enter for new line · Smart AI responses powered by NCERT curriculum
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="resources-view"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex-1 overflow-y-auto p-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Study Vault</h2>
                  <p className="text-sm font-bold text-slate-400">Master every chapter with AI-curated resources</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Physics Mastery", topics: ["Electromagnetism", "Optics", "Modern Physics"], color: "indigo" },
                  { title: "Chemistry Hub", topics: ["Organic Chemistry", "Periodic Table", "Chemical Bonding"], color: "rose" },
                  { title: "Biology Central", topics: ["Genetics", "Life Processes", "Ecology"], color: "emerald" },
                  { title: "Maths Advanced", topics: ["Calculus", "Probability", "Triangles"], color: "amber" },
                ].map((subject, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{subject.title}</h3>
                      <div className={`w-8 h-8 rounded-xl bg-${subject.color}-50 text-${subject.color}-600 flex items-center justify-center`}>
                        <Zap size={16} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {subject.topics.map((t, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm font-bold text-slate-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors" />
                          {t}
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center text-xs font-black text-indigo-600 gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      Open Library <Bot size={12} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};