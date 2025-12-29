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
        setTimeout(() => {
          navigate(`/dashboard/${projectId}`);
        }, 3000);
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
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div
                className={`p-2 rounded-lg ${isCrawling ? "bg-indigo-600 animate-pulse" : "bg-slate-200"} text-white shadow-lg`}
              >
                <Activity className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Live Crawl Audit
              </h1>
            </div>
            <p className="text-slate-500 font-medium">
              Real-time site exploration and analysis engine
            </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
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
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <p className="text-sm text-green-800 font-bold leading-tight">
                    Crawl finished. Preparing your global dashboard reports...
                  </p>
                </div>
              )}
            </div>

            {/* Real-time URLs list */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Recent Page Responses
                </h3>
                <Layers className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-3">
                {crawledUrls.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl">
                    <Database className="w-8 h-8 text-slate-200 mb-2" />
                    <p className="text-sm text-slate-400 font-bold">
                      Waiting for live data stream...
                    </p>
                  </div>
                ) : (
                  crawledUrls.map((url, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200 group"
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
                        className={`px-3 py-1 text-xs font-black rounded-lg ${
                          url.statusCode >= 200 && url.statusCode < 300
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        HTTP {url.statusCode}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Activity Log */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 sticky top-10">
              <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center space-x-3">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Activity Log
                  </span>
                </div>
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                </div>
              </div>
              <div className="p-6 h-[600px] overflow-y-auto custom-scrollbar font-mono text-xs space-y-2">
                {activityFeed.length === 0 ? (
                  <p className="text-slate-600 italic">
                    No activity detected yet...
                  </p>
                ) : (
                  activityFeed.map((log, i) => (
                    <div
                      key={i}
                      className="flex space-x-3 animate-in fade-in slide-in-from-left-2 duration-300"
                    >
                      <span className="text-slate-600 shrink-0 font-bold text-[10px]">
                        [{log.timestamp}]
                      </span>
                      <span
                        className={`${
                          log.message.includes("Error") ||
                          log.message.includes("Failed")
                            ? "text-red-400"
                            : "text-slate-300"
                        } leading-relaxed`}
                      >
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
