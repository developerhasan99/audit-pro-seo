import { Project } from '../../api/projects.api';
import { useProjectStore } from '../../store/projectStore';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface ProjectDeleteModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export default function ProjectDeleteModal({ project, isOpen, onClose, onDeleted }: ProjectDeleteModalProps) {
  const { deleteProject, loading, error } = useProjectStore();

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 pb-0 flex justify-end">
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-8 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Project?</h3>
          <p className="text-slate-500 font-bold mb-8">
            This will permanently remove <span className="text-slate-900">{hostname}</span> and all associated audit reports, crawl logs, and issue history. This action cannot be undone.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold">
              {error}
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full py-4 bg-red-600 border-2 border-red-600 hover:bg-red-700 text-white rounded-2xl text-base font-black shadow-xl shadow-red-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Trash2 className="w-5 h-5" />
              <span>{loading ? 'Deleting...' : 'Permanently Delete'}</span>
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-full py-4 text-slate-500 font-bold text-base hover:text-slate-700 transition-colors"
            >
              Keep Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
