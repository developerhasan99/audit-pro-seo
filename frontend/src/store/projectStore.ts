import { create } from "zustand";
import { projectsApi, Project } from "../api/projects.api";

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

      set((state) => {
        let nextSelectedId = state.selectedProjectId;
        let nextCurrentProject = state.currentProject;

        // Auto-select first project if none is selected
        if (!nextSelectedId && response.projects.length > 0) {
          nextSelectedId = response.projects[0].id;
          nextCurrentProject = response.projects[0];
        } else if (nextSelectedId && response.projects.length > 0) {
          // If selected project no longer exists in value list (e.g. was deleted elsewhere), fallback to first
          const exists = response.projects.find(
            (p: Project) => p.id === nextSelectedId
          );
          if (!exists) {
            nextSelectedId = response.projects[0].id;
            nextCurrentProject = response.projects[0];
          }
        }

        return {
          projects: response.projects,
          loading: false,
          selectedProjectId: nextSelectedId,
          currentProject: nextCurrentProject || state.currentProject, // Keep existing if valid
        };
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to fetch projects",
        loading: false,
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
        error: error.response?.data?.error || "Failed to fetch project",
        loading: false,
      });
    }
  },

  createProject: async (data: any) => {
    set({ loading: true, error: null });
    try {
      const response = await projectsApi.create(data);
      // Assuming response.project contains the created project
      const newProject = response.project;

      set((state) => ({
        projects: [newProject, ...state.projects],
        selectedProjectId: newProject.id,
        // We set currentProject so components using it update immediately
        currentProject: newProject,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to create project",
        loading: false,
      });
      throw error;
    }
  },

  updateProject: async (id: number, data: any) => {
    set({ loading: true, error: null });
    try {
      const response = await projectsApi.update(id, data);
      set((state) => ({
        // Update the project in the list
        projects: state.projects.map((p) =>
          p.id === id ? { ...p, ...response.project } : p
        ),
        // Update currentProject if it's the one being modified
        currentProject:
          state.currentProject?.id === id
            ? { ...state.currentProject, ...response.project }
            : state.currentProject,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to update project",
        loading: false,
      });
      throw error;
    }
  },

  deleteProject: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await projectsApi.delete(id);
      set((state) => {
        const remainingProjects = state.projects.filter((p) => p.id !== id);
        let nextSelectedId = state.selectedProjectId;
        let nextCurrentProject = state.currentProject;

        // If the deleted project was the selected one
        if (state.selectedProjectId === id) {
          // Select the first available project, or null if none remain
          if (remainingProjects.length > 0) {
            nextSelectedId = remainingProjects[0].id;
            // Ideally we'd have the full project object, but for now we might clear it
            // and let the component fetch it, or if projects list has enough info:
            nextCurrentProject = remainingProjects[0];
            // Note: If projects list items are summary only, fetching might be needed by the consumer
            // But this provides immediate feedback
          } else {
            nextSelectedId = null;
            nextCurrentProject = null;
          }
        }

        return {
          projects: remainingProjects,
          selectedProjectId: nextSelectedId,
          currentProject: nextCurrentProject,
          loading: false,
        };
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || "Failed to delete project",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
