import React from 'react';
import { motion } from 'motion/react';
import { Zap, Flame, Trophy, Target, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: any;
  color: string;
  trend: string;
  isPositive?: boolean;
  data: any[];
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, value, sub, icon: Icon, color, trend, isPositive = true, data 
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-xl hover:shadow-indigo-500/5"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
          <Icon size={24} style={{ color }} />
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-black text-slate-900 leading-tight">{value}</h3>
        <p className="text-base font-bold text-slate-500 mt-1 uppercase tracking-tight">{label}</p>
        <p className="text-sm font-semibold text-slate-400 mt-1.5">{sub}</p>
      </div>

      {/* Mini Sparkline */}
      <div className="mt-4 h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`color-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#color-${label})`} 
              strokeWidth={2}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

interface DashboardStatsProps {
  stats: any[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard 
          key={stat.label}
          {...stat}
          data={Array.from({ length: 7 }, () => ({ value: Math.floor(Math.random() * 40) + 10 }))}
        />
      ))}
    </div>
  );
};
