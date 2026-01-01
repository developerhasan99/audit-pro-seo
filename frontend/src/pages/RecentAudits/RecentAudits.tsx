import { useNavigate, Link } from "react-router-dom";
import { Plus } from "lucide-react";
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
  const { data: crawls = [], isLoading: isCrawlsLoading } = useCrawls(
    selectedProjectId || undefined
  );

  const isLoading = selectedProjectId ? isCrawlsLoading : false;
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

  return (
    <Layout title="Recent Audits">
      <div className="flex items-center flex-wrap justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-black text-slate-900">Audit History</h2>
          <p className="text-sm font-medium text-slate-400 mt-1 hidden md:block">
            <strong className="text-black">{crawls.length}</strong> Audits Found
            for {currentProject?.url}
          </p>
          <p className="text-sm font-medium text-slate-400 mt-1 block md:hidden">
            <strong className="text-black">{crawls.length}</strong> Recent
            Audits
          </p>
        </div>
        <Link
          to={`/crawl/live/${selectedProjectId}`}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>New Crawl</span>
        </Link>
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
            onClick={() =>
              selectedProjectId && navigate(`/crawl/live/${selectedProjectId}`)
            }
            disabled={!selectedProjectId}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              selectedProjectId
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
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
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group overflow-hidden flex flex-col"
              >
                {/* Header with Status Badge */}
                <div className="p-6 pb-4 border-b border-slate-50 flex justify-between items-start">
                  <div>
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-indigo-100 text-indigo-600 animate-pulse"
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                          Completed
                        </>
                      ) : (
                        <>
                          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
                          Running
                        </>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">
                        {new Date(crawl.start).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-xs font-medium text-slate-400 mt-0.5">
                        {new Date(crawl.start).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(crawl.id, e)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  {/* Health Score & Key Stats */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-slate-100"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={2 * Math.PI * 28}
                            strokeDashoffset={
                              2 * Math.PI * 28 * (1 - healthScore / 100)
                            }
                            className={`${
                              healthScore >= 90
                                ? "text-emerald-500"
                                : healthScore >= 50
                                  ? "text-amber-500"
                                  : "text-rose-500"
                            } transition-all duration-1000 ease-out`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span
                          className={`absolute text-lg font-black ${
                            healthScore >= 90
                              ? "text-emerald-500"
                              : healthScore >= 50
                                ? "text-amber-500"
                                : "text-rose-500"
                          }`}
                        >
                          {healthScore}
                        </span>
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Health Score
                        </span>
                        <span className="text-sm text-slate-500 font-medium">
                          Out of 100
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Pages
                      </span>
                      <span className="text-lg font-black text-slate-700">
                        {crawl.totalUrls}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Issues
                      </span>
                      <span
                        className={`text-lg font-black ${
                          crawl.totalIssues > 0
                            ? "text-rose-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {crawl.totalIssues}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Duration
                      </span>
                      <span className="text-sm font-black text-slate-700 flex items-center">
                        <Clock className="w-3 h-3 mr-1.5 text-slate-400" />
                        {duration}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Robots.txt
                      </span>
                      <span className="text-sm font-black flex items-center">
                        {crawl.robotstxtExists ? (
                          <span className="text-emerald-600 flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-1.5" />
                            Found
                          </span>
                        ) : (
                          <span className="text-amber-500 flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-1.5" />
                            Missing
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/${selectedProjectId}?crawlId=${crawl.id}`
                      )
                    }
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 rounded-xl text-sm font-bold transition-all duration-300"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Full Report</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
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
