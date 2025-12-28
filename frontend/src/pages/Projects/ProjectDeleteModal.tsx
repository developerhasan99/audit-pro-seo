import { Project } from '../../api/projects.api';
import { useProjectStore } from '../../store/projectStore';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ProjectDeleteModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export default function ProjectDeleteModal({ project, isOpen, onClose, onDeleted }: ProjectDeleteModalProps) {
  const { deleteProject, loading, error, clearError } = useProjectStore();

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      onDeleted();
      onClose();
    } catch (err) {
      // Error handled by store
    }
  };

  const hostname = new URL(project.url).hostname.replace('www.', '');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white border-none rounded-[2.5rem] p-10 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-4 text-center">
          <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-in zoom-in-50 duration-500">
            <div className="w-16 h-16 bg-red-100 rounded-[1.75rem] flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Delete Project?
          </h3>
          <p className="text-slate-500 font-bold leading-relaxed px-4">
            You are about to permanently scrub <span className="text-slate-900 font-black underline decoration-red-200 underline-offset-4">{hostname}</span> and all its data. This cannot be reversed.
          </p>
        </div>

        {error && (
          <div className="my-6 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-black flex items-center space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-8">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="h-16 w-full bg-red-600 hover:bg-red-700 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            )}
            <span>{loading ? 'Purging Data...' : 'Confirm Destruction'}</span>
          </button>
          
          <button
            onClick={onClose}
            disabled={loading}
            className="h-16 w-full rounded-[1.5rem] font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
          >
            Keep Project Alive
          </button>
        </div>
      </div>
    </div>
  );
}
