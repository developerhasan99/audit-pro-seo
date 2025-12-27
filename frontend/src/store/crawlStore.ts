import { create } from 'zustand';
import { crawlsApi, Crawl } from '../api/crawls.api';

interface CrawlState {
  crawls: Crawl[];
  selectedCrawlId: number | null;
  loading: boolean;
  error: string | null;
  
  fetchHistory: (projectId: number) => Promise<void>;
  setSelectedCrawlId: (id: number | null) => void;
  reset: () => void;
}

export const useCrawlStore = create<CrawlState>((set) => ({
  crawls: [],
  selectedCrawlId: null,
  loading: false,
  error: null,

  fetchHistory: async (projectId: number) => {
    set({ loading: true, error: null });
    try {
      const crawls = await crawlsApi.getHistory(projectId);
      set({ crawls, loading: false });
      
      // Auto-select latest if none selected
      if (crawls.length > 0) {
        set((state) => ({ 
          selectedCrawlId: state.selectedCrawlId || crawls[0].id 
        }));
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setSelectedCrawlId: (id: number | null) => set({ selectedCrawlId: id }),

  reset: () => set({ crawls: [], selectedCrawlId: null, error: null }),
}));
