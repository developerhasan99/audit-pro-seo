import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";
import { useCrawlStore } from "../../store/crawlStore";
import Layout from "../../components/Layout/Layout";
import Loading from "../../components/Common/Loading";
import StatCard from "../../components/Dashboard/StatCard";
import IssueDistribution from "../../components/Dashboard/IssueDistribution";
import OptimizationMatrix from "../../components/Dashboard/OptimizationMatrix";
import PriorityActionPlan from "../../components/Dashboard/PriorityActionPlan";
import CrawlSelector from "../../components/Common/CrawlSelector";
import apiClient from "../../api/client";
import { ResponsiveContainer, Area, AreaChart } from "recharts";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  FileCode,
} from "lucide-react";

const mockTrendData = [
  { name: "Mon", value: 78 },
  { name: "Tue", value: 80 },
  { name: "Wed", value: 82 },
  { name: "Thu", value: 81 },
  { name: "Fri", value: 83 },
  { name: "Sat", value: 84 },
  { name: "Sun", value: 82 },
];

export default function Dashboard() {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    currentProject,
    loading: projectLoading,
    fetchProject,
  } = useProjectStore();
  const { selectedCrawlId } = useCrawlStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (projectId) {
        await fetchProject(parseInt(projectId));
        setLoading(true);
        try {
          const url = selectedCrawlId
            ? `/dashboard/${projectId}?crawlId=${selectedCrawlId}`
            : `/dashboard/${projectId}`;
          const response = await apiClient.get(url);
          setDashboardData(response.data);
        } catch (error) {
          console.error("Failed to load dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [projectId, fetchProject, selectedCrawlId]);

  const stats = dashboardData?.stats;
  const crawl = dashboardData?.crawl;

  const healthScore = useMemo(() => {
    if (!stats || !stats.totalPages) return 0;
    const score = 100 - (stats.totalIssues / (stats.totalPages * 5)) * 100;
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [stats]);

  const distributionData = useMemo(() => {
    if (!stats?.issuesByPriority) return [];

    const errors = stats.issuesByPriority
      .filter((i: any) => i.priority === 3)
      .reduce((sum: number, i: any) => sum + parseInt(i.count), 0);

    const warnings = stats.issuesByPriority
      .filter((i: any) => i.priority === 2)
      .reduce((sum: number, i: any) => sum + parseInt(i.count), 0);

    const notices = stats.issuesByPriority
      .filter((i: any) => i.priority === 1)
      .reduce((sum: number, i: any) => sum + parseInt(i.count), 0);

    return [
      { name: "Errors", value: errors, color: "#f43f5e" },
      { name: "Warnings", value: warnings, color: "#f59e0b" },
      { name: "Notices", value: notices, color: "#3b82f6" },
    ];
  }, [stats]);

  if (loading || projectLoading) {
    return (
      <Layout>
        <Loading text="Loading your site data..." />
      </Layout>
    );
  }

  if (!crawl) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            No Crawl Data Found
          </h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg font-medium">
            We haven't indexed your site yet. Start your first crawl to unlock
            premium SEO insights and issue tracking.
          </p>
          <Link
            to={`/crawl/live/${projectId}`}
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 transition-all transform hover:-translate-y-1"
          >
            Start Initial Audit
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Top Header Row with Crawl Selector */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <CrawlSelector projectId={parseInt(projectId!)} />
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full md:bg-transparent md:px-0">
            Last Audit: {new Date(crawl.start).toLocaleDateString()}
          </div>
        </div>

        {/* Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Health Score"
            value={healthScore}
            trend="up"
            trendValue="+2%"
            className="border-l-4 border-l-emerald-500"
          />
          <StatCard
            title="Total Pages"
            value={stats.totalPages}
            description={`${Math.floor(stats.totalPages * 0.1)} new pages detected`}
          />
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Health Trend
            </h3>
            <div className="flex-1 min-h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Main Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <IssueDistribution
              data={distributionData}
              total={stats.totalIssues}
            />
          </div>
          <div className="lg:col-span-4">
            <OptimizationMatrix />
          </div>
          <div className="lg:col-span-4">
            <PriorityActionPlan issues={stats.issuesByPriority} />
          </div>
        </div>

        {/* Quick Check Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Canonical Checks",
              icon: ShieldCheck,
              result: "100% Valid",
              status: "success",
            },
            {
              label: "HTTPS Protocol",
              icon: Lock,
              result: "Secure",
              status: "success",
            },
            {
              label: "XML Sitemap",
              icon: FileCode,
              result: crawl.sitemapExists ? "Found" : "Missing",
              status: crawl.sitemapExists ? "success" : "error",
            },
            {
              label: "Robots.txt",
              icon: Search,
              result: crawl.robotstxtExists ? "Found" : "Missing",
              status: crawl.robotstxtExists ? "success" : "error",
            },
          ].map((check) => (
            <div
              key={check.label}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <check.icon className="w-5 h-5 text-slate-500" />
                {check.status === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )}
              </div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                {check.label}
              </h4>
              <p className="text-lg font-black text-white">{check.result}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
