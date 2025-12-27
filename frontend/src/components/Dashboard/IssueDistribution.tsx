import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';

interface IssueDistributionProps {
  data: Array<{ name: string; value: number; color: string }>;
  total: number;
}

export default function IssueDistribution({ data, total }: IssueDistributionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-full flex flex-col">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Issue Distribution</h3>
      
      <div className="flex-1 relative flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-3xl font-black text-slate-900 leading-none">{total}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</div>
        </div>

        <div className="w-full mt-6 space-y-3">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between group cursor-default">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-bold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
