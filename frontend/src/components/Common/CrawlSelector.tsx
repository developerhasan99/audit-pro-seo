import { useEffect, useState, useRef } from "react";
import { useCrawlStore } from "../../store/crawlStore";
import {
  History,
  ChevronDown,
  Calendar,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function CrawlSelector() {
  const { crawls, selectedCrawlId, setSelectedCrawlId, loading } =
    useCrawlStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedCrawl =
    crawls.find((c) => c.id === selectedCrawlId) || crawls[0];

  if (loading && crawls.length === 0) {
    return (
      <div className="h-10 w-48 bg-slate-100 animate-pulse rounded-xl"></div>
    );
  }

  if (crawls.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-3 bg-white border transition-all duration-200 rounded-xl p-2 min-w-[240px] text-left group ${
          isOpen
            ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
            : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
        }`}
      >
        <div className="bg-indigo-50 p-1.5 rounded-lg group-hover:bg-indigo-100 transition-colors">
          <History className="w-4 h-4 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">
            Audit Version
          </p>
          <div className="flex items-center text-xs font-bold text-slate-700 truncate">
            {selectedCrawl ? (
              <>
                <span className="truncate">
                  {new Date(selectedCrawl.start).toLocaleDateString()}
                </span>
                <span className="mx-1 text-slate-300">|</span>
                <span className="text-slate-500 font-medium">
                  {new Date(selectedCrawl.start).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </>
            ) : (
              "Select a crawl"
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 max-h-[300px] overflow-y-auto w-[320px] animate-in fade-in zoom-in-95 duration-100">
          <div className="p-2 space-y-1">
            {crawls.map((crawl) => {
              const isSelected = selectedCrawl?.id === crawl.id;
              return (
                <button
                  key={crawl.id}
                  onClick={() => {
                    setSelectedCrawlId(crawl.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start p-2 rounded-xl transition-all ${
                    isSelected
                      ? "bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div
                    className={`mt-0.5 mr-3 p-1.5 rounded-lg ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}
                  >
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div
                      className={`text-sm font-bold ${isSelected ? "text-indigo-900" : "text-slate-900"}`}
                    >
                      {new Date(crawl.start).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div className="flex items-center mt-1 space-x-3 text-xs opacity-80">
                      <span className="flex items-center">
                        <History className="w-3 h-3 mr-1" />
                        {new Date(crawl.start).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        {crawl.totalUrls} Pages
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600 mt-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
