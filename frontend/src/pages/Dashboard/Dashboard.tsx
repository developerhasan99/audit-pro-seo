import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import { useCrawlStore } from '../../store/crawlStore';
import Layout from '../../components/Layout/Layout';
import Loading from '../../components/Common/Loading';
import SimpleChart from '../../components/Charts/SimpleChart';
import CrawlSelector from '../../components/Common/CrawlSelector';
import apiClient from '../../api/client';


export default function Dashboard() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, loading: projectLoading, fetchProject } = useProjectStore();
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
          console.error('Failed to load dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [projectId, fetchProject, selectedCrawlId]);

  if (loading || projectLoading) {
    return (
      <Layout>
        <Loading text="Loading dashboard..." />
      </Layout>
    );
  }

  if (!currentProject) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">Project not found</p>
        </div>
      </Layout>
    );
  }

  const crawl = dashboardData?.crawl;
  const stats = dashboardData?.stats;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{currentProject.url}</p>
          </div>
          {projectId && <CrawlSelector projectId={parseInt(projectId)} />}
        </div>

        {!crawl ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              No Crawl Data
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start a crawl to see your SEO analysis dashboard.
            </p>
            <Link
              to={`/crawl/live/${projectId}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Start Crawl
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Issues Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Site Issues
                </h2>
                <Link
                  to={`/issues/${projectId}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All Issues →
                </Link>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Found {stats?.totalIssues || 0} issues across {stats?.totalPages || 0} pages
              </p>
            </div>

            {/* Crawl Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Current Crawl
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Crawled On</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {new Date(crawl.start).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">URLs Crawled</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {crawl.totalUrls || 0}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sitemap</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {crawl.sitemapExists ? '✓ Found' : '✗ Not Found'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Robots.txt</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {crawl.robotstxtExists ? '✓ Found' : '✗ Not Found'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Codes Chart */}
            {stats?.statusCodes && stats.statusCodes.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Status Codes
                </h2>
                <SimpleChart
                  data={stats.statusCodes.map((sc: any) => ({
                    name: `${sc.statusCode}`,
                    value: parseInt(sc.count),
                  }))}
                />
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Explore Issues
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  View and analyze all SEO issues found during the crawl.
                </p>
                <Link
                  to={`/issues/${projectId}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Issues →
                </Link>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Export Data
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Download your crawl data in various formats.
                </p>
                <Link
                  to={`/export/${projectId}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Export Data →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
