import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';

export default function CrawlLive() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [crawlStatus, setCrawlStatus] = useState<any>(null);
  const [crawledUrls, setCrawledUrls] = useState<any[]>([]);
  const [stopping, setStopping] = useState(false);

  useEffect(() => {
    // Start the crawl
    const startCrawl = async () => {
      try {
        await axios.post(`/api/crawl/start/${projectId}`);
      } catch (error) {
        console.error('Failed to start crawl:', error);
      }
    };
    startCrawl();

    // Poll for status (WebSocket would be better, but this works)
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/crawl/status/${projectId}`);
        setCrawlStatus(response.data);
        
        if (!response.data.crawling) {
          clearInterval(interval);
          setTimeout(() => {
            navigate(`/dashboard/${projectId}`);
          }, 2000);
        }
      } catch (error) {
        console.error('Failed to get status:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [projectId, navigate]);

  const handleStop = async () => {
    setStopping(true);
    try {
      await axios.post(`/api/crawl/stop/${projectId}`);
    } catch (error) {
      console.error('Failed to stop crawl:', error);
    }
  };

  const progress = crawlStatus
    ? ((crawlStatus.crawled / (crawlStatus.crawled + crawlStatus.discovered)) * 100) || 0
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Live Crawling</h1>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {crawlStatus?.crawled || 0} URLs Crawled
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {crawlStatus?.discovered || 0} URLs discovered
              </p>
            </div>
            <button
              onClick={handleStop}
              disabled={stopping || !crawlStatus?.crawling}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {stopping ? 'Stopping...' : 'Stop Crawl'}
            </button>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-primary-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status Message */}
        {!crawlStatus?.crawling && crawlStatus?.crawled > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-6">
            <p className="text-green-800 dark:text-green-200 font-semibold">
              Crawl completed! Redirecting to dashboard...
            </p>
          </div>
        )}

        {/* Recent URLs (placeholder - would come from WebSocket) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recently Crawled URLs
          </h2>
          <div className="space-y-2">
            {crawledUrls.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">Crawling in progress...</p>
            ) : (
              crawledUrls.map((url, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-900 dark:text-white truncate">{url.url}</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    url.statusCode >= 200 && url.statusCode < 300
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {url.statusCode}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
