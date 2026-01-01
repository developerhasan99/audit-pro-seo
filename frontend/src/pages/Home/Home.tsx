import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";

export default function Home() {
  const { projects, loading, fetchProjects } = useProjectStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchProjects();
      setIsReady(true);
    };
    loadData();
  }, [fetchProjects]);

  if (loading || !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">
            Booting AuditPro...
          </p>
        </div>
      </div>
    );
  }

  // 1. No projects -> Add Project page
  if (projects.length === 0) {
    return <Navigate to="/projects/add" replace />;
  }

  // 2. Has projects -> Go to the global Recent Audits Dashboard
  return <Navigate to="/recent-audits" replace />;
}
