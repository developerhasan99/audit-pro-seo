import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

const mockData = [
  { subject: 'Technical', A: 85, fullMark: 100 },
  { subject: 'Speed', A: 70, fullMark: 100 },
  { subject: 'Content', A: 90, fullMark: 100 },
  { subject: 'UX', A: 65, fullMark: 100 },
  { subject: 'Acc', A: 80, fullMark: 100 },
];

export default function OptimizationMatrix() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full flex flex-col items-center justify-center">
      <h3 className="w-full text-left text-sm font-bold text-slate-800 uppercase tracking-wider mb-8">Optimization Matrix</h3>
      
      <div className="w-full flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
            />
            <Radar
              name="Optimization"
              dataKey="A"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Calculated across 43 on-page signals
      </p>
    </div>
  );
}
