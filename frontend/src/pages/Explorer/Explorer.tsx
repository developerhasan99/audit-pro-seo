import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCrawlStore } from '../../store/crawlStore';
import Layout from '../../components/Layout/Layout';
import Loading from '../../components/Common/Loading';
import Pagination from '../../components/Common/Pagination';
import CrawlSelector from '../../components/Common/CrawlSelector';
import apiClient from '../../api/client';


export default function Explorer() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCrawlId } = useCrawlStore();
  
  const [pageReports, setPageReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [total, setTotal] = useState(0);
  const limit = 50;

  useEffect(() => {
    const loadPages = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/explorer/${projectId}`, {
          params: { search, page, limit, crawlId: selectedCrawlId },
        });
        setPageReports(response.data.pageReports);
        setTotal(response.data.total);
      } catch (error) {
        console.error('Failed to load pages:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPages();
  }, [projectId, search, page, selectedCrawlId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ search, page: '1' });
  };

  if (loading) {
    return (
      <Layout>
        <Loading text="Loading pages..." />
      </Layout>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">URL Explorer</h1>
          {projectId && <CrawlSelector projectId={parseInt(projectId)} />}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search URLs..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                  Words
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pageReports.map((pr) => (
                <tr key={pr.id}>
                  <td className="px-6 py-4 text-sm">
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {pr.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {pr.title || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded ${
                      pr.statusCode >= 200 && pr.statusCode < 300
                        ? 'bg-green-100 text-green-800'
                        : pr.statusCode >= 300 && pr.statusCode < 400
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pr.statusCode}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {pr.words || 0}
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
            onPageChange={(newPage) => {
              setPage(newPage);
              setSearchParams({ search, page: newPage.toString() });
            }}
          />
        )}
      </div>
    </Layout>
  );
}
