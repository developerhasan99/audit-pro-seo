import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import Layout from '../../components/Layout/Layout';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Globe, 
  Shield, 
  Network, 
  Search, 
  ChevronRight,
  ExternalLink,
  Zap,
  Clock
} from 'lucide-react';
import ProjectSettingsModal from './ProjectSettingsModal';
import ProjectDeleteModal from './ProjectDeleteModal';
import { Project } from '../../api/projects.api';

export default function ProjectList() {
  const navigate = useNavigate();
  const { projects, loading, fetchProjects } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  const handleOpenSettings = (project: Project) => {
    setSelectedProject(project);
    setIsSettingsOpen(true);
  };

  const handleOpenDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  return (
    <Layout title="All Projects">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-slate-900">Project Management</h2>
            <p className="text-sm font-medium text-slate-400 mt-1">Manage and monitor your website audits</p>
          </div>
          <Link
            to="/projects/add"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Project</span>
          </Link>
        </div>

        {loading && projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No projects yet</h3>
            <p className="text-slate-500 font-bold mb-8 max-w-sm mx-auto">
              Ready to start your first SEO audit? Add a website to begin tracking its performance.
            </p>
            <Link
              to="/projects/add"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-indigo-600 text-white text-base font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
            >
              <Zap className="w-5 h-5" />
              <span>Create Your First Project</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => {
              const hostname = getHostname(project.url);
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                          <Globe className="w-7 h-7 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <div className="overflow-hidden">
                          <h3 className="text-xl font-black text-slate-900 truncate leading-tight">{hostname}</h3>
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-slate-400 hover:text-indigo-500 flex items-center space-x-1 mt-0.5 transition-colors"
                          >
                            <span className="truncate">{project.url}</span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </a>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => handleOpenSettings(project)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleOpenDelete(project)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-xl">
                        <Shield className={`w-3.5 h-3.5 ${project.ignoreRobotstxt ? 'text-indigo-500' : 'text-slate-300'}`} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Robots.txt</span>
                      </div>
                      <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-xl">
                        <Network className={`w-3.5 h-3.5 ${project.crawlSitemap ? 'text-indigo-500' : 'text-slate-300'}`} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Sitemap</span>
                      </div>
                    </div>

                    <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">
                      <Clock className="w-3 h-3 mr-1.5" />
                      Added: {new Date(project.created!).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/dashboard/${project.id}`)}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all active:scale-95"
                      >
                        <span>View Analytics</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/crawl/live/${project.id}`)}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 text-xs font-black rounded-xl transition-all active:scale-95"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Start Audit</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedProject && (
          <>
            <ProjectSettingsModal 
              project={selectedProject} 
              isOpen={isSettingsOpen} 
              onClose={() => {
                setIsSettingsOpen(false);
                setSelectedProject(null);
              }} 
            />
            <ProjectDeleteModal 
              project={selectedProject} 
              isOpen={isDeleteOpen} 
              onClose={() => {
                setIsDeleteOpen(false);
                setSelectedProject(null);
              }}
              onDeleted={() => fetchProjects()}
            />
          </>
        )}
    </Layout>
  );
}
