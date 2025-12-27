interface IssueItem {
  id: number;
  type: string;
  priority: number;
  count: number;
}

interface PriorityActionPlanProps {
  issues: IssueItem[];
}

export default function PriorityActionPlan({ issues }: PriorityActionPlanProps) {
  const getImpact = (priority: number) => {
    switch (priority) {
      case 3: return { label: 'High Impact', color: 'bg-rose-100 text-rose-600 border-rose-200' };
      case 2: return { label: 'Medium Impact', color: 'bg-orange-100 text-orange-600 border-orange-200' };
      default: return { label: 'Low Impact', color: 'bg-amber-100 text-amber-600 border-amber-200' };
    }
  };

  // Sort issues by priority (High first) and then by count
  const sortedIssues = [...issues].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.count - a.count;
  }).slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Priority Action Plan</h3>
      </div>
      
      <div className="flex-1">
        {sortedIssues.map((issue, index) => {
          const impact = getImpact(issue.priority);
          return (
            <div key={issue.id} className="p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-0 group cursor-default">
              <div className="flex items-start space-x-4">
                <div className="mt-1 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs shrink-0 group-hover:bg-slate-200 group-hover:text-slate-600 transition-colors">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{issue.type}</h4>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter border ${impact.color}`}>
                      {impact.label}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      {issue.count} {issue.count === 1 ? 'Page' : 'Pages'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full py-4 text-xs font-bold text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-widest border-t border-slate-100">
        View All Recommendations →
      </button>
    </div>
  );
}
