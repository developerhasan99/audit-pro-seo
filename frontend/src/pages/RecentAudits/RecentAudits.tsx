import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";
import { useCrawls, useDeleteCrawl } from "../../hooks/useCrawls";
import Layout from "../../components/Layout/Layout";
import {
  Activity,
  ChevronRight,
  Trash2,
  FileText,
  AlertTriangle,
} from "lucide-react";

export default function RecentAudits() {
  const navigate = useNavigate();
  const { selectedProjectId, selectedProject } = useProjectStore();
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
    <Layout title={`Audits: ${selectedProject?.url || "Project"}`}>
      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-900">Audit History</h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Recent crawls for {selectedProject?.url}
        </p>
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
          {crawls.map((crawl) => (
            <div
              key={crawl.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleDelete(crawl.id, e)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Audit"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Date
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {new Date(crawl.start).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Pages
                    </span>
                    <span className="text-sm font-bold text-slate-700">
                      {crawl.totalUrls}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Issues
                    </span>
                    <div className="flex items-center space-x-2">
                      {crawl.totalIssues > 0 && (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      <span
                        className={`text-sm font-bold ${crawl.totalIssues > 0 ? "text-amber-600" : "text-emerald-600"}`}
                      >
                        {crawl.totalIssues}
                      </span>
                    </div>
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
                  <span>View Full Report</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
