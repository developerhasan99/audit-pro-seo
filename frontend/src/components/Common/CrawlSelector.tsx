import { useEffect } from 'react';
import { useCrawlStore } from '../../store/crawlStore';

interface CrawlSelectorProps {
  projectId: number;
}

export default function CrawlSelector({ projectId }: CrawlSelectorProps) {
  const { crawls, selectedCrawlId, fetchHistory, setSelectedCrawlId, loading } = useCrawlStore();

  useEffect(() => {
    fetchHistory(projectId);
  }, [projectId, fetchHistory]);

  if (loading && crawls.length === 0) {
    return (
      <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
    );
  }

  if (crawls.length === 0) return null;

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="crawl-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Crawl:
      </label>
      <select
        id="crawl-select"
        value={selectedCrawlId || ''}
        onChange={(e) => setSelectedCrawlId(Number(e.target.value))}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        {crawls.map((crawl) => (
          <option key={crawl.id} value={crawl.id}>
            {new Date(crawl.start).toLocaleString()} ({crawl.totalUrls} URLs)
          </option>
        ))}
      </select>
    </div>
  );
}
