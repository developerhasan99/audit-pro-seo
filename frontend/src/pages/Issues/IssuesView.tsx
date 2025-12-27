import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Loading from '../../components/Common/Loading';
import Pagination from '../../components/Common/Pagination';
import apiClient from '../../api/client';

export default function IssuesView() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const issueType = searchParams.get('type');
  
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const response = await apiClient.get(`/issues/${projectId}`, {
          params: { issueType, page, limit },
        });
        setIssues(response.data.issues);
        setTotal(response.data.total);
      } catch (error) {
        console.error('Failed to load issues:', error);
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, [projectId, issueType, page]);

  if (loading) {
    return (
      <Layout>
        <Loading text="Loading issues..." />
      </Layout>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/issues/${projectId}`} className="text-primary-600 hover:text-primary-700 text-sm">
          ← Back to Issues
        </Link>
        
        <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Issue Details
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {issues.map((issue) => (
                <tr key={issue.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <Link
                      to={`/resources/${projectId}/${issue.pageReport?.id}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {issue.pageReport?.url}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {issue.pageReport?.title || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {issue.pageReport?.statusCode || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </Layout>
  );
}
