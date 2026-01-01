import apiClient from "./client";

export interface Crawl {
  id: number;
  projectId: number;
  start: string;
  end?: string;
  totalUrls: number;
  totalIssues: number;
  issuesEnd?: string;
  robotstxtExists: boolean;
  sitemapExists: boolean;
  sitemapIsBlocked: boolean;
  crawled: number;
}

export const crawlsApi = {
  start: async (projectId: number) => {
    const response = await apiClient.post(`/crawl/start/${projectId}`);
    return response.data;
  },

  stop: async (projectId: number) => {
    const response = await apiClient.post(`/crawl/stop/${projectId}`);
    return response.data;
  },

  getStatus: async (projectId: number) => {
    const response = await apiClient.get(`/crawl/status/${projectId}`);
    return response.data;
  },

  getHistory: async (projectId: number): Promise<Crawl[]> => {
    const response = await apiClient.get(`/crawl/history/${projectId}`);
    return response.data;
  },

  delete: async (crawlId: number) => {
    const response = await apiClient.delete(`/crawl/${crawlId}`);
    return response.data;
  },

  getPages: async (crawlId: number) => {
    const response = await apiClient.get(`/crawl/${crawlId}/pages`);
    return response.data;
  },
};
