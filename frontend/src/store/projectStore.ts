import { create } from 'zustand';
import { projectsApi, Project } from '../api/projects.api';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  selectedProjectId: number | null;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: number) => Promise<void>;
  setSelectedProjectId: (id: number | null) => void;
  createProject: (data: any) => Promise<void>;
  updateProject: (id: number, data: any) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  selectedProjectId: null,
  loading: false,
  error: null,

  setSelectedProjectId: (id: number | null) => set({ selectedProjectId: id }),

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const response = await projectsApi.getAll();
      set({ projects: response.projects, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch projects', 
        loading: false 
      });
    }
  },

  fetchProject: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await projectsApi.getById(id);
      set({ currentProject: response.project, loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to fetch project', 
        loading: false 
      });
    }
  },

  createProject: async (data: any) => {
    set({ loading: true, error: null });
    try {
      await projectsApi.create(data);
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to create project', 
        loading: false 
      });
      throw error;
    }
  },

  updateProject: async (id: number, data: any) => {
    set({ loading: true, error: null });
    try {
      await projectsApi.update(id, data);
      set({ loading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to update project', 
        loading: false 
      });
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await projectsApi.delete(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.error || 'Failed to delete project', 
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
