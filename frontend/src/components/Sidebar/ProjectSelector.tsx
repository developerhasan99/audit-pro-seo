import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import { ChevronDown, Plus, Globe, Check } from 'lucide-react';

interface ProjectSelectorProps {
  onClose?: () => void;
}

export default function ProjectSelector({ onClose }: ProjectSelectorProps) {
  const navigate = useNavigate();
  const { projects, currentProject, fetchProjects } = useProjectStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  }, [projects.length, fetchProjects]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProjectSelect = (projectId: number) => {
    navigate(`/dashboard/${projectId}`);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleAddProject = () => {
    navigate('/');
    setIsOpen(false);
    if (onClose) onClose();
  };

  const getDisplayName = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="relative px-4 mb-2" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
          ${isOpen ? 'bg-slate-800' : 'bg-slate-800/50 hover:bg-slate-800'}
          border border-slate-700/50 group
        `}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
            <Globe className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-left overflow-hidden">
            <p className="text-xs font-black text-slate-300 uppercase tracking-widest truncate">
              {currentProject ? getDisplayName(currentProject.url) : 'Select Project'}
            </p>
            <p className="text-[10px] text-slate-500 font-bold truncate">
              {currentProject?.url || 'No project selected'}
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-4 right-4 mt-2 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
            {projects.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-bold text-slate-400">No projects found</p>
              </div>
            ) : (
              projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectSelect(project.id)}
                  className={`
                    w-full flex items-center justify-between p-3 transition-colors text-left
                    ${currentProject?.id === project.id ? 'bg-indigo-600/10' : 'hover:bg-slate-700/50'}
                  `}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-7 h-7 rounded-md bg-slate-700 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-slate-400">
                        {getDisplayName(project.url).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <p className={`text-xs font-bold truncate ${currentProject?.id === project.id ? 'text-indigo-400' : 'text-slate-300'}`}>
                        {getDisplayName(project.url)}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{project.url}</p>
                    </div>
                  </div>
                  {currentProject?.id === project.id && (
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
          
          <button
            onClick={handleAddProject}
            className="w-full flex items-center space-x-3 p-4 bg-slate-800 border-t border-slate-700 hover:bg-slate-700 transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-black text-white uppercase tracking-wider">Add New Project</span>
          </button>
        </div>
      )}
    </div>
  );
}

