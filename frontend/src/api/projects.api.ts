import apiClient from './client';

export interface Project {
  id: number;
  userId: number;
  url: string;
  created?: Date;
  ignoreRobotstxt?: boolean;
  followNofollow?: boolean;
  includeNoindex?: boolean;
  crawlSitemap?: boolean;
  allowSubdomains?: boolean;
  deleting?: boolean;
  basicAuth?: boolean;
  checkExternalLinks?: boolean;
  archive?: boolean;
  userAgent?: string;
  crawls?: any[];
}

export interface CreateProjectData {
  url: string;
  ignoreRobotstxt?: boolean;
  followNofollow?: boolean;
  includeNoindex?: boolean;
  crawlSitemap?: boolean;
  allowSubdomains?: boolean;
  basicAuth?: boolean;
  checkExternalLinks?: boolean;
  archive?: boolean;
  userAgent?: string;
}

export const projectsApi = {
  getAll: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectData) => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreateProjectData>) => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },
};
