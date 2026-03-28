import React from 'react';
import { motion } from 'motion/react';
import { Target, BookOpen, Clock, CheckCircle2, Award, Zap } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'quiz' | 'chapter' | 'badge' | 'streak';
  title: string;
  subtitle: string;
  time: string;
  xp?: number;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="mt-6 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm shadow-indigo-500/5 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xl font-black text-slate-900">Recent Activity</h3>
          <p className="text-base font-semibold text-slate-400">Your latest learning achievements</p>
        </div>
        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View History</button>
      </div>

      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-100 before:via-slate-50 before:to-transparent">
        {activities.map((activity, i) => (
          <div key={activity.id} className="relative flex items-center gap-4 pl-10 group">
            <div className="absolute left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-slate-50 text-slate-500 shadow-sm transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110">
              {activity.type === 'quiz' && <Target size={16} />}
              {activity.type === 'chapter' && <BookOpen size={16} />}
              {activity.type === 'badge' && <Award size={16} />}
              {activity.type === 'streak' && <Flame size={16} />}
              {!['quiz', 'chapter', 'badge', 'streak'].includes(activity.type) && <Zap size={16} />}
            </div>
            
            <div className="flex flex-1 items-center justify-between gap-4 rounded-2xl border border-slate-50 bg-slate-50/30 p-4 transition-all hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-500/5">
              <div className="flex flex-col">
                <h4 className="text-base font-black text-slate-900 leading-tight">{activity.title}</h4>
                <p className="text-sm font-semibold text-slate-400 mt-0.5">{activity.subtitle}</p>
              </div>
              
              <div className="flex flex-col items-end gap-1 text-right">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Clock size={12} />
                  {activity.time}
                </div>
                {activity.xp && (
                  <div className="text-xs font-black text-indigo-600">
                    +{activity.xp} XP
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Simple Flame icon for streak
const Flame = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 3.5 6.5 1.5 2 2 4.5 2 7a6 6 0 1 1-12 0c0-1 1-2 1-3.5" />
  </svg>
);
