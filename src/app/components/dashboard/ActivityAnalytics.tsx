import React from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { TrendingUp, Award, Target, BookOpen } from 'lucide-react';

interface ActivityAnalyticsProps {
  xpData: any[];
  radarData: any[];
}

export const ActivityAnalytics: React.FC<ActivityAnalyticsProps> = ({ xpData, radarData }) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mt-6">
      {/* XP Progress Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="lg:col-span-2 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm shadow-indigo-500/5 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl font-black text-slate-900">Learning Activity</h3>
            <p className="text-base font-semibold text-slate-400">Your XP earnings over the past 7 days</p>
          </div>
          <div className="flex h-11 items-center gap-2 rounded-2xl bg-indigo-50 px-5 py-2 text-sm font-bold text-indigo-600 shadow-sm shadow-indigo-500/5 transition-all hover:bg-indigo-100">
            <TrendingUp size={16} /> Weekly Insight
          </div>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={xpData}>
              <defs>
                <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="xp" 
                stroke="#4F46E5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#primaryGrad)" 
                dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Subject Mastery Radar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm shadow-indigo-500/5 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
      >
        <div className="flex flex-col gap-1.5 mb-8">
          <h3 className="text-xl font-black text-slate-900">Subject Mastery</h3>
          <p className="text-base font-semibold text-slate-400">Accuracy breakdown per subject</p>
        </div>

        <div className="h-[250px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#64748B', fontSize: 11, fontWeight: 800 }}
              />
              <Radar
                name="Consistency"
                dataKey="accuracy"
                stroke="#7C3AED"
                fill="#7C3AED"
                fillOpacity={0.15}
                strokeWidth={3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
