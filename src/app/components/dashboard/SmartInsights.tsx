import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Brain, Lightbulb, Zap, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Recommendation {
  title: string;
  description: string;
  type: 'practice' | 'revision' | 'challenge';
  subject: string;
  id: string;
}

interface SmartInsightsProps {
  recommendations: Recommendation[];
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({ recommendations }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={22} className="text-amber-500" />
        <h3 className="text-xl font-black text-slate-900 leading-none">Smart AI Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/subjects/${rec.id}`)}
            className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-indigo-100 bg-white p-5 shadow-sm transition-all hover:bg-slate-50 hover:shadow-xl hover:shadow-indigo-500/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                {rec.type === 'practice' ? <Brain size={18} /> : rec.type === 'challenge' ? <Zap size={18} /> : <Lightbulb size={18} />}
              </div>
              <div className="flex h-4 items-center gap-1 rounded font-black text-xs text-slate-300 uppercase letter-spacing-wider">
                {rec.subject}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="text-base font-black text-slate-900 transition-colors group-hover:text-indigo-600">
                {rec.title}
              </h4>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                {rec.description}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <Clock size={13} />
                5-10 min session
              </div>
              <div className="rounded-full bg-slate-50 p-2 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ArrowRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}

        {/* AI Insight Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:col-span-1 rounded-[24px] border border-amber-100 bg-amber-50/50 p-5 shadow-sm transition-all"
        >
          <div className="flex items-center gap-2 mb-3">
             <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Lightbulb size={14} />
             </div>
             <p className="text-xs font-black text-amber-700 uppercase">Pro Tip</p>
          </div>
          <p className="text-base font-bold text-slate-800 leading-relaxed">
            "Your performance in <span className="text-indigo-600 font-black">Organic Chemistry</span> is improving. Focusing on <span className="text-indigo-600 font-black">NCERT Exemplar</span> could boost your accuracy further."
          </p>
          <div className="mt-4 flex h-8 w-fit items-center gap-2 rounded-full bg-white px-3.5 text-xs font-black text-amber-700 shadow-sm transition-all cursor-pointer hover:bg-amber-100">
            Learn More
          </div>
        </motion.div>
      </div>
    </div>
  );
};
