import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";
import Layout from "../../components/Layout/Layout";
import { Activity, ChevronRight, Clock } from "lucide-react";

export default function RecentAudits() {
  const navigate = useNavigate();
  const { projects, loading, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch (e) {
      return url;
    }
  };

  const recentCrawls = projects
    .flatMap((p) => (p.crawls || []).map((c) => ({ ...c, project: p })))
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
    .slice(0, 20);

  return (
    <Layout title="Recent Audits">
      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-900">Activity Log</h2>
        <p className="text-sm font-medium text-slate-400 mt-1">
          Recent crawl activity across all your projects
        </p>
      </div>

      {loading && projects.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : recentCrawls.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No activity yet</h3>
          <p className="text-slate-500">
            Start a crawl on a project to see it here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-slate-100">
            {recentCrawls.map((crawl, idx) => (
              <div
                key={`${crawl.id}-${idx}`}
                className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {getHostname(crawl.project.url)
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {getHostname(crawl.project.url)}
                    </h4>
                    <div className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-wider space-x-3 mt-1">
                      <span>{crawl.totalUrls} Pages</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>{crawl.totalIssues} Issues</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-right hidden sm:block">
                    <div className="flex items-center justify-end text-xs font-bold text-slate-900 mb-1">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      {new Date(crawl.start).toLocaleDateString()}
                    </div>
                    <div className="text-[10px] font-medium text-slate-400">
                      {new Date(crawl.start).toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/dashboard/${crawl.project.id}`)}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
                  >
                    <span>View Report</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
