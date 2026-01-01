import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";
import { useCrawls, useDeleteCrawl } from "../../hooks/useCrawls";
import Layout from "../../components/Layout/Layout";
import {
  Activity,
  ChevronRight,
  Trash2,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function RecentAudits() {
  const navigate = useNavigate();
  const { selectedProjectId, currentProject } = useProjectStore();
  const { data: crawls = [], isLoading } = useCrawls(
    selectedProjectId || undefined
  );
  const { mutate: deleteCrawl } = useDeleteCrawl();

  const handleDelete = (crawlId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this audit record?")) {
      deleteCrawl(crawlId);
    }
  };

  const calculateHealth = (crawl: any) => {
    if (!crawl.totalUrls) return 0;
    const score = 100 - (crawl.totalIssues / (crawl.totalUrls * 5)) * 100;
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const calculateDuration = (start: string, end?: string) => {
    if (!end) return "Running";
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (!selectedProjectId) {
    return (
      <Layout title="Recent Audits">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
            <Activity className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">
            No Project Selected
          </h2>
          <p className="text-slate-500 max-w-sm">
            Select a project from the sidebar to view its audit history.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Audits: ${currentProject?.url || "Project"}`}>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900">Audit History</h2>
            <p className="text-sm font-medium text-slate-400 mt-1">
              Recent crawls for {currentProject?.url}
            </p>
          </div>
          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            {crawls.length} Audits Found
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : crawls.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No audits yet</h3>
          <p className="text-slate-500 mb-6">
            Start a crawl to generate your first audit report.
          </p>
          <button
            onClick={() => navigate(`/crawl/live/${selectedProjectId}`)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            Start New Audit
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {crawls.map((crawl) => {
            const healthScore = calculateHealth(crawl);
            const duration = calculateDuration(crawl.start, crawl.end);
            const isCompleted = !!crawl.end;

            return (
              <div
                key={crawl.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group overflow-hidden flex flex-col relative"
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${isCompleted ? "bg-emerald-500" : "bg-indigo-500 animate-pulse"}`}
                ></div>

                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {new Date(crawl.start).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {new Date(crawl.start).toLocaleTimeString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDelete(crawl.id, e)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors -mr-2 -mt-2"
                      title="Delete Audit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Health Score Main */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-4 border-slate-100 flex items-center justify-center">
                        <span
                          className={`text-lg font-black ${healthScore >= 90 ? "text-emerald-500" : healthScore >= 50 ? "text-amber-500" : "text-rose-500"}`}
                        >
                          {healthScore}
                        </span>
                      </div>
                      <div className="absolute -bottom-2 w-full text-center">
                        <span className="text-[10px] font-bold bg-white px-1 text-slate-400">
                          Score
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-xl font-black text-slate-800">
                          {crawl.totalUrls}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Pages
                        </span>
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        <span
                          className={`text-xl font-black ${crawl.totalIssues > 0 ? "text-amber-500" : "text-emerald-500"}`}
                        >
                          {crawl.totalIssues}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Issues
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-400 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        Duration
                      </span>
                      <span className="font-bold text-slate-700">
                        {duration}
                      </span>
                    </div>
                    {/* Checks */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-400 flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                        Robots.txt
                      </span>
                      <span
                        className={`font-bold ${crawl.robotstxtExists ? "text-emerald-500" : "text-amber-500"}`}
                      >
                        {crawl.robotstxtExists ? "Found" : "Missing"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/${selectedProjectId}?crawlId=${crawl.id}`
                      )
                    }
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm rounded-xl text-sm font-bold transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Full Report</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
