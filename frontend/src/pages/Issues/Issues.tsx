import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import { useCrawlStore } from '../../store/crawlStore';
import Layout from '../../components/Layout/Layout';
import Loading from '../../components/Common/Loading';
import CrawlSelector from '../../components/Common/CrawlSelector';
import apiClient from '../../api/client';

export default function Issues() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, fetchProject } = useProjectStore();
  const { selectedCrawlId } = useCrawlStore();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (projectId) {
        await fetchProject(parseInt(projectId));
        setLoading(true);
        try {
          const url = selectedCrawlId 
            ? `/issues/${projectId}/summary?crawlId=${selectedCrawlId}` 
            : `/issues/${projectId}/summary`;
          const response = await apiClient.get(url);
          setSummary(response.data.summary);
        } catch (error) {
          console.error('Failed to load issues:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [projectId, fetchProject, selectedCrawlId]);

  if (loading) {
    return (
      <Layout>
        <Loading text="Loading issues..." />
      </Layout>
    );
  }

  const categorizeIssues = () => {
    if (!summary) return { critical: [], alert: [], warning: [] };
    
    const critical: any[] = [];
    const alert: any[] = [];
    const warning: any[] = [];

    summary.forEach((item: any) => {
      const priority = item.issueType?.priority || 'low';
      if (priority === 'critical') critical.push(item);
      else if (priority === 'alert') alert.push(item);
      else warning.push(item);
    });

    return { critical, alert, warning };
  };

  const { critical, alert, warning } = categorizeIssues();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/dashboard/${projectId}`} className="text-primary-600 hover:text-primary-700 text-sm">
            ← Back to Dashboard
          </Link>
          <div className="mt-2 flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Issues</h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">{currentProject?.url}</p>
            </div>
            {projectId && <CrawlSelector projectId={parseInt(projectId)} />}
          </div>
        </div>

        {!summary || summary.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-2">No Issues Found!</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Great! Your website passed all SEO checks.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Critical Issues */}
            {critical.length > 0 && (
              <div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
                  <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Critical Issues
                  </h2>
                  <p className="text-red-700 dark:text-red-300 mt-1">
                    These issues require immediate attention.
                  </p>
                </div>
                {critical.map((issue: any) => (
                  <div key={issue.issueTypeId} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {issue.type || 'Unknown Issue'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {issue.count} {issue.count === 1 ? 'URL' : 'URLs'} affected
                        </p>
                      </div>
                      <Link
                        to={`/issues/${projectId}/view?type=${issue.issueTypeId}`}
                        className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
                      >
                        View Issues
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Alert Issues */}
            {alert.length > 0 && (
              <div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-4">
                  <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Alert Issues
                  </h2>
                  <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                    These issues should be addressed soon.
                  </p>
                </div>
                {alert.map((issue: any) => (
                  <div key={issue.issueTypeId} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {issue.type || 'Unknown Issue'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {issue.count} {issue.count === 1 ? 'URL' : 'URLs'} affected
                        </p>
                      </div>
                      <Link
                        to={`/issues/${projectId}/view?type=${issue.issueTypeId}`}
                        className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
                      >
                        View Issues
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Warning Issues */}
            {warning.length > 0 && (
              <div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
                  <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Warnings
                  </h2>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">
                    These are minor issues to consider.
                  </p>
                </div>
                {warning.map((issue: any) => (
                  <div key={issue.issueTypeId} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {issue.type || 'Unknown Issue'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {issue.count} {issue.count === 1 ? 'URL' : 'URLs'} affected
                        </p>
                      </div>
                      <Link
                        to={`/issues/${projectId}/view?type=${issue.issueTypeId}`}
                        className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
                      >
                        View Issues
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
