import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCrawlStore } from '../../store/crawlStore';
import Layout from '../../components/Layout/Layout';
import apiClient from '../../api/client';

export default function CrawlLive() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { setSelectedCrawlId } = useCrawlStore();
  const [crawlStatus, setCrawlStatus] = useState<any>(null);
  const [crawledUrls, setCrawledUrls] = useState<any[]>([]);
  const [stopping, setStopping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Start the crawl via REST
    const startCrawl = async () => {
      try {
        const response = await apiClient.post(`/crawl/start/${projectId}`);
        if (response.data.crawlId) {
          setSelectedCrawlId(response.data.crawlId);
        }
      } catch (error) {
        console.error('Failed to start crawl:', error);
      }
    };
    startCrawl();

    // Initial status fetch
    const fetchStatus = async () => {
      try {
        const response = await apiClient.get(`/crawl/status/${projectId}`);
        setCrawlStatus(response.data);
      } catch (error) {
        console.error('Failed to get status:', error);
      }
    };
    fetchStatus();

    // Setup authenticated WebSocket
    const token = localStorage.getItem('token');
    const wsUrl = `ws://localhost:3000?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'CRAWL_STARTED' && message.payload.projectId === parseInt(projectId!)) {
        console.log('Crawl started event received');
        setCrawlStatus((prev: any) => ({ ...prev, crawling: true }));
      }

      if (message.type === 'CRAWL_PROGRESS' && message.payload.projectId === parseInt(projectId!)) {
        setCrawlStatus(message.payload);
        if (message.payload.lastUrl) {
          setCrawledUrls((prev) => [message.payload.lastUrl, ...prev].slice(0, 10));
        }
      }
      
      if (message.type === 'CRAWL_COMPLETED' && message.payload.projectId === parseInt(projectId!)) {
        setCrawlStatus((prev: any) => ({ ...prev, crawling: false }));
        setTimeout(() => {
          navigate(`/dashboard/${projectId}`);
        }, 2000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [projectId, navigate]);

  const handleStop = async () => {
    setStopping(true);
    try {
      await apiClient.post(`/crawl/stop/${projectId}`);
    } catch (error) {
      console.error('Failed to stop crawl:', error);
    }
  };

  const total = (crawlStatus?.crawled || 0) + (crawlStatus?.discovered || 0);
  const progress = total > 0 ? (crawlStatus.crawled / total) * 100 : 0;

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
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status Message */}
        {crawlStatus && !crawlStatus.crawling && crawlStatus.crawled > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-6">
            <p className="text-green-800 dark:text-green-200 font-semibold">
              Crawl completed! Redirecting to dashboard...
            </p>
          </div>
        )}

        {/* Recent URLs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recently Crawled URLs
          </h2>
          <div className="space-y-2">
            {crawledUrls.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                {crawlStatus?.crawling ? 'Crawling in progress...' : 'Waiting for updates...'}
              </p>
            ) : (
              crawledUrls.map((url, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded transition-all">
                  <span className="text-sm text-gray-900 dark:text-white truncate max-w-[80%]">{url.url}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    url.statusCode >= 200 && url.statusCode < 300
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
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

