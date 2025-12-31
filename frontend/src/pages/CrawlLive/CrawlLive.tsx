import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCrawlStore } from "../../store/crawlStore";
import Layout from "../../components/Layout/Layout";
import apiClient from "../../api/client";
import {
  Activity,
  Terminal,
  Search,
  Globe,
  StopCircle,
  Play,
  CheckCircle2,
  Layers,
  Database,
} from "lucide-react";

interface StatusUpdate {
  message: string;
  timestamp: string;
}

export default function CrawlLive() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { setSelectedCrawlId } = useCrawlStore();
  const [crawlStatus, setCrawlStatus] = useState<any>(null);
  const [crawledUrls, setCrawledUrls] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<StatusUpdate[]>([]);
  const [stopping, setStopping] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const addActivity = useCallback((message: string) => {
    console.log(new Date().toLocaleTimeString(), message);
    setActivityFeed((prev) =>
      [{ message, timestamp: new Date().toLocaleTimeString() }, ...prev].slice(
        0,
        50
      )
    );
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current) return;

    const token = localStorage.getItem("token");
    const wsUrl = `ws://localhost:3000?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (
        message.type === "CRAWL_STARTED" &&
        message.payload.projectId === parseInt(projectId!)
      ) {
        setCrawlStatus((prev: any) => ({ ...prev, crawling: true }));
        addActivity("Crawl engine started sequentially.");
      }

      if (
        message.type === "CRAWL_STATUS_UPDATE" &&
        message.payload.projectId === parseInt(projectId!)
      ) {
        addActivity(message.payload.message);
      }

      if (
        message.type === "CRAWL_PROGRESS" &&
        message.payload.projectId === parseInt(projectId!)
      ) {
        setCrawlStatus(message.payload);
        if (message.payload.lastUrl) {
          setCrawledUrls((prev) =>
            [message.payload.lastUrl, ...prev].slice(0, 10)
          );
          addActivity(
            `Crawled: ${message.payload.lastUrl.url} (${message.payload.lastUrl.statusCode})`
          );
        }
      }

      if (
        message.type === "CRAWL_COMPLETED" &&
        message.payload.projectId === parseInt(projectId!)
      ) {
        setCrawlStatus((prev: any) => ({ ...prev, crawling: false }));
        addActivity("Crawl operation finished successfully.");
        // setTimeout(() => {
        //   navigate(`/dashboard/${projectId}`);
        // }, 3000);
      }

      if (
        message.type === "CRAWL_STOPPED" &&
        message.payload.projectId === parseInt(projectId!)
      ) {
        setCrawlStatus((prev: any) => ({ ...prev, crawling: false }));
        addActivity("Crawl operation was manually stopped.");
        setStopping(false);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      addActivity("Connection error occurred.");
    };
  }, [projectId, navigate, addActivity]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await apiClient.get(`/crawl/status/${projectId}`);
        setCrawlStatus(response.data);

        if (response.data.crawling) {
          connectWebSocket();
          addActivity("Resumed connection to active crawl.");
          // Estimate duration or fetch from backend if available
        }
      } catch (error) {
        console.error("Failed to get status:", error);
      }
    };
    fetchStatus();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [projectId, connectWebSocket, addActivity]);

  const handleStart = async () => {
    try {
      addActivity("Initiating crawl request...");
      const response = await apiClient.post(`/crawl/start/${projectId}`);
      if (response.data.crawlId) {
        setSelectedCrawlId(response.data.crawlId);
      }
      setCrawlStatus((prev: any) => ({ ...prev, crawling: true }));
      connectWebSocket();
    } catch (error) {
      console.error("Failed to start crawl:", error);
      addActivity("Failed to initiate crawl.");
    }
  };

  const handleStop = async () => {
    setStopping(true);
    try {
      addActivity("Requesting crawl suspension...");
      await apiClient.post(`/crawl/stop/${projectId}`);
    } catch (error) {
      console.error("Failed to stop crawl:", error);
      setStopping(false);
    }
  };

  // Calculate progress: when crawled >= discovered, we're at 100%
  // Otherwise show the ratio of crawled to discovered
  const crawled = crawlStatus?.crawled || 0;
  const discovered = crawlStatus?.discovered || 0;
  const progress =
    discovered > 0 ? Math.min((crawled / discovered) * 100, 100) : 0;
  const isCrawling = crawlStatus?.crawling;

  return (
    <Layout title="Live Crawl Audit">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div
              className={`size-12 flex items-center justify-center rounded-lg ${isCrawling ? "bg-indigo-600 animate-pulse" : "bg-slate-200"} text-white shadow-lg`}
            >
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Live Crawl Audit
              </h2>
              <p className="text-sm font-medium text-slate-400 mt-1">
                Real-time site exploration and analysis engine
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            {!isCrawling ? (
              <button
                onClick={handleStart}
                className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm transition-all shadow-lg active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch New Audit</span>
              </button>
            ) : (
              <button
                onClick={handleStop}
                disabled={stopping}
                className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-xl font-black text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                <StopCircle className="w-4 h-4" />
                <span>{stopping ? "Suspending..." : "Stop Audit"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Progress Section */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            {/* Horizontal Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Crawl Progress
                </h3>
                <span className="text-2xl font-black text-indigo-600">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="relative w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  {isCrawling && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Below Progress Bar */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Pages Crawled
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {crawled}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Discovered
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {discovered}
                  </p>
                </div>
              </div>
            </div>

            {/* Completion Message */}
            {!isCrawling && crawled > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <p className="text-sm text-green-800 font-bold leading-tight">
                    Crawl completed successfully! Your audit report is ready.
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/dashboard/${projectId}`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm active:scale-95"
                >
                  <span>View Dashboard</span>
                </button>
              </div>
            )}
          </div>

          {/* Real-time URLs list */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                {crawledUrls.length === 0
                  ? "Crawl Activity"
                  : "Recent Crawled URLs"}
              </h3>
              {crawledUrls.length === 0 ? (
                <Terminal className="w-5 h-5 text-slate-400" />
              ) : (
                <Layers className="w-5 h-5 text-slate-400" />
              )}
            </div>
            {crawledUrls.length === 0 ? (
              <div className="p-2 border-2 border-dashed border-slate-100 rounded-2xl min-h-[300px]">
                {activityFeed.length === 0 ? (
                  <div className="mt-20 text-center flex flex-col items-center">
                    <Terminal className="w-8 h-8 text-slate-200 mb-2" />
                    <p className="text-sm text-slate-400 font-bold">
                      Waiting for live data stream...
                    </p>
                  </div>
                ) : (
                  activityFeed.map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 animate-in fade-in slide-in-from-left-2 duration-300"
                    >
                      <span className="text-slate-300 shrink-0 font-bold text-xs">
                        [{log.timestamp}]
                      </span>
                      <span
                        className={`font-mono ${
                          log.message.includes("Error") ||
                          log.message.includes("Failed")
                            ? "text-red-400"
                            : "text-slate-700"
                        } leading-relaxed`}
                      >
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3 min-h-[400px]">
                {crawledUrls.map((url, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200 group"
                  >
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <div
                        className={`shrink-0 w-2 h-2 rounded-full ${
                          url.statusCode < 400 ? "bg-green-400" : "bg-red-400"
                        }`}
                      ></div>
                      <span className="text-sm text-slate-700 font-semibold truncate group-hover:text-indigo-600 transition-colors">
                        {url.url}
                      </span>
                    </div>
                    <span
                      className={`shrink-0 px-3 py-1 text-xs font-medium tracking-tight rounded-full ${
                        url.statusCode >= 200 && url.statusCode < 300
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      HTTP {url.statusCode}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
