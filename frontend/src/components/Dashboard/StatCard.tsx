import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendValue?: string;
  icon?: LucideIcon;
  description?: string;
  color?: string;
  className?: string;
}

export default function StatCard({ 
  title, 
  value, 
  trend, 
  trendValue, 
  description,
  className = "" 
}: StatCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
      </div>
      
      <div className="flex items-baseline space-x-4">
        <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{value}</span>
        {trend && (
          <div className="flex flex-col">
            <span className={`text-xs font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend === 'up' ? '↑' : '↓'} {trendValue}
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">v. last scan</span>
          </div>
        )}
      </div>

      {description && (
        <p className="mt-4 text-xs font-medium text-slate-400 italic">
          {description}
        </p>
      )}
    </div>
  );
}
