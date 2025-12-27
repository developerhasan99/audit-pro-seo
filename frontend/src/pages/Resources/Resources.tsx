import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Loading from '../../components/Common/Loading';
import Tabs from '../../components/Common/Tabs';
import apiClient from '../../api/client';

export default function Resources() {
  const { projectId, pageReportId } = useParams<{ projectId: string; pageReportId: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await apiClient.get(`/resources/${projectId}/${pageReportId}`);
        setData(response.data);
      } catch (error) {
        console.error('Failed to load page report:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [projectId, pageReportId]);

  if (loading) {
    return (
      <Layout>
        <Loading text="Loading page details..." />
      </Layout>
    );
  }

  const pageReport = data?.pageReport;

  const tabs = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">URL</label>
              <p className="text-gray-900 dark:text-white">{pageReport?.url}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status Code</label>
              <p className="text-gray-900 dark:text-white">{pageReport?.statusCode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</label>
              <p className="text-gray-900 dark:text-white">{pageReport?.title || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
              <p className="text-gray-900 dark:text-white">{pageReport?.description || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">H1</label>
              <p className="text-gray-900 dark:text-white">{pageReport?.h1 || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Canonical</label>
              <p className="text-gray-900 dark:text-white">{pageReport?.canonical || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</label>
              <p className="text-gray-900 dark:text-white">{pageReport?.lang || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Word Count</label>
              <p className="text-gray-900 dark:text-white">{pageReport?.words || 0}</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'issues',
      label: 'Issues',
      content: (
        <div>
          {data?.issues && data.issues.length > 0 ? (
            <ul className="space-y-2">
              {data.issues.map((issue: any) => (
                <li key={issue.id} className="p-4 bg-red-50 dark:bg-red-900/20 rounded">
                  {issue.issueType?.type}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No issues found for this page.</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Page Details</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <Tabs tabs={tabs} defaultTab="details" />
        </div>
      </div>
    </Layout>
  );
}
