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
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { useState } from "react";

export default function RecentAudits() {
  const navigate = useNavigate();
  const { selectedProjectId, currentProject } = useProjectStore();
  const { data: crawls = [], isLoading: isCrawlsLoading } = useCrawls(
    selectedProjectId || undefined
  );

  const isLoading = selectedProjectId ? isCrawlsLoading : false;
  const { mutate: deleteCrawl } = useDeleteCrawl();

  // State for deletion
  const [auditToDelete, setAuditToDelete] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeleteClick = (crawlId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAuditToDelete(crawlId);
  };

  const confirmDelete = () => {
    if (auditToDelete) {
      setDeletingId(auditToDelete);
      deleteCrawl(auditToDelete, {
        onSettled: () => {
          setDeletingId(null);
        },
      });
      setAuditToDelete(null);
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
            const isDeleting = deletingId === crawl.id;

            return (
              <div
                key={crawl.id}
                onClick={() =>
                  !isDeleting &&
                  navigate(
                    `/dashboard/${selectedProjectId}?crawlId=${crawl.id}`
                  )
                }
                className={`bg-white rounded-xl border border-slate-200 transition-all duration-200 flex flex-col overflow-hidden relative ${
                  isDeleting
                    ? "opacity-80 pointer-events-none ring-2 ring-rose-100"
                    : "hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 cursor-pointer group"
                }`}
              >
                {isDeleting && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex items-center justify-center flex-col">
                    <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-2" />
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                      Deleting Audit...
                    </span>
                  </div>
                )}

                {/* Header: Date, Status, Delete */}
                <div className="px-5 py-4 flex justify-between items-start border-b border-slate-50">
                  <div className="flex flex-col">
                    <div className="mb-2">
                      {isCompleted ? (
                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                          <CheckCircle2 className="w-3 h-3 mr-1.5" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Audit Complete
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                          <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">
                            Scanning Site
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-900 leading-none">
                        {new Date(crawl.start).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">
                        {new Date(crawl.start).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(crawl.id, e)}
                    disabled={isDeleting}
                    className="p-1.5 bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Body: Metrics */}
                <div className="p-5 flex items-center justify-between">
                  {/* Health Score - Prominent */}
                  <div className="flex flex-col items-center pr-6 border-r border-slate-100">
                    <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="5"
                          fill="none"
                          className="text-slate-100"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="5"
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
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-xl font-black ${
                            healthScore >= 90
                              ? "text-slate-900"
                              : healthScore >= 50
                                ? "text-slate-900"
                                : "text-slate-900"
                          }`}
                        >
                          {healthScore}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Health
                    </span>
                  </div>

                  {/* Compact Stats Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-4 pl-6">
                    {/* Pages */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Pages
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {crawl.totalUrls}
                      </span>
                    </div>

                    {/* Issues */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Issues
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          crawl.totalIssues > 0
                            ? "text-rose-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {crawl.totalIssues}
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Duration
                      </span>
                      <span className="text-sm font-bold text-slate-700">
                        {duration}
                      </span>
                    </div>

                    {/* Robots */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Robots
                      </span>
                      <span
                        className={`text-sm font-bold ${
                          crawl.robotstxtExists
                            ? "text-emerald-600"
                            : "text-amber-500"
                        }`}
                      >
                        {crawl.robotstxtExists ? "Found" : "Missing"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer: View Report Link (Hover only) */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-indigo-50/30 transition-colors">
                  <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition-colors flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-2" />
                    Open Report
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {auditToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setAuditToDelete(null)}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden ring-1 ring-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                Delete Audit Record?
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                This will permanently remove this audit and all its crawled
                data. This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setAuditToDelete(null)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 px-4 bg-rose-500 text-white text-sm font-bold rounded-xl hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
            <button
              onClick={() => setAuditToDelete(null)}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
