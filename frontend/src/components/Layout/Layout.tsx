import { ReactNode, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useProjectStore } from '../../store/projectStore';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = "Dashboard" }: LayoutProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { setSelectedProjectId, fetchProject, currentProject } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      const id = parseInt(projectId);
      setSelectedProjectId(id);
      if (!currentProject || currentProject.id !== id) {
        fetchProject(id);
      }
    }
  }, [projectId, setSelectedProjectId, fetchProject, currentProject]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Topbar 
          title={title} 
          onMenuClick={() => setIsSidebarOpen(true)} 
        />
        
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>

        <footer className="px-8 py-6 border-t border-slate-200 text-slate-400 text-xs font-medium flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p>© 2024 AuditPro. Premium SEO Analytics Tool.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
            <a href="#" className="hover:text-slate-600">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}


