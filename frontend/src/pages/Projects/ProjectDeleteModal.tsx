import { Project } from '../../api/projects.api';
import { useProjectStore } from '../../store/projectStore';
import { AlertTriangle, Trash2, } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';

interface ProjectDeleteModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export default function ProjectDeleteModal({ project, isOpen, onClose, onDeleted }: ProjectDeleteModalProps) {
  const { deleteProject, loading, error, clearError } = useProjectStore();

  const handleDelete = async () => {
    console.log('[DEBUG] Deleting project:', project.id);
    try {
      await deleteProject(project.id);
      console.log('[DEBUG] Project deleted successfully');
      onDeleted();
      onClose();
    } catch (err) {
      console.error('[DEBUG] Deletion failed:', err);
    }
  };

  const hostname = new URL(project.url).hostname.replace('www.', '');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-none rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
        <DialogHeader className="pt-4">
          <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-in zoom-in-50 duration-500">
            <div className="w-16 h-16 bg-red-100 rounded-[1.75rem] flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <DialogTitle className="text-3xl font-black text-slate-900 text-center tracking-tight mb-2">
            Delete Project?
          </DialogTitle>
          <DialogDescription className="text-center text-slate-500 font-bold leading-relaxed px-4">
            You are about to permanently scrub <span className="text-slate-900 font-black underline decoration-red-200 underline-offset-4">{hostname}</span> and all its data. This cannot be reversed.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="my-6 p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-black flex items-center space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>{error}</span>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-col gap-4 mt-8">
          <Button
            variant="destructive"
            size="lg"
            onClick={handleDelete}
            disabled={loading}
            className="h-16 w-full rounded-[1.5rem] font-black text-lg shadow-xl shadow-red-100 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            )}
            <span>{loading ? 'Purging Data...' : 'Confirm Destruction'}</span>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            disabled={loading}
            className="h-16 w-full rounded-[1.5rem] font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Keep Project Alive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
