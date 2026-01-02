import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./store/authStore";

// Pages
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProjectList from "./pages/Projects/ProjectList";
import ProjectAdd from "./pages/Projects/ProjectAdd";
import RecentAudits from "./pages/RecentAudits/RecentAudits";
import Issues from "./pages/Issues/Issues";
import IssuesView from "./pages/Issues/IssuesView";
import Explorer from "./pages/Explorer/Explorer";
import Resources from "./pages/Resources/Resources";
import Export from "./pages/Export/Export";
import CrawlLive from "./pages/CrawlLive/CrawlLive";
import Account from "./pages/Account/Account";

import SiteStructure from "./pages/SiteStructure/SiteStructure";
import { useProjectStore } from "./store/projectStore";
import FullPageLoader from "./components/Common/FullPageLoader";

// Wrapper to require at least one project
function RequireProject({ children }: { children: JSX.Element }) {
  const { projects, error } = useProjectStore();

  // If there was an error fetching, show it instead of redirecting
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center border border-red-100">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Unable to load projects
          </h3>
          <p className="text-sm text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return <Navigate to="/projects/add" />;
  }

  return children;
}

const queryClient = new QueryClient();

function App() {
  const { user, initialized: authInitialized, checkAuth } = useAuthStore();
  const { initialized: projectInitialized, fetchProjects } = useProjectStore();
  const { projects, error } = useProjectStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch projects when user is authenticated
  useEffect(() => {
    if (user && !projectInitialized) {
      fetchProjects();
    }
  }, [user, projectInitialized, fetchProjects]);

  // Consolidated loading state: Wait for Auth, and if user exists, wait for Projects
  // This prevents flickering by keeping a single loader until EVERYTHING is ready
  const isAppReady = authInitialized && (!user || projectInitialized);

  if (!isAppReady) {
    return <FullPageLoader text="Initializing Workspace..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/signin"
            element={!user ? <SignIn /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <SignUp /> : <Navigate to="/" />}
          />

          {/* Protected routes */}
          <Route
            path="/projects/add"
            element={user ? <ProjectAdd /> : <Navigate to="/signin" />}
          />

          {/* Routes requiring a project */}
          <Route
            path="/"
            element={
              user ? (
                <RequireProject>
                  <Navigate to={`/dashboard/${projects[0].id}`} />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/projects"
            element={
              user ? (
                <RequireProject>
                  <ProjectList />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/recent-audits"
            element={
              user ? (
                <RequireProject>
                  <RecentAudits />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/dashboard/:projectId"
            element={
              user ? (
                <RequireProject>
                  <Dashboard />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/issues/:projectId"
            element={
              user ? (
                <RequireProject>
                  <Issues />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/issues/:projectId/view"
            element={
              user ? (
                <RequireProject>
                  <IssuesView />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/explorer/:projectId"
            element={
              user ? (
                <RequireProject>
                  <Explorer />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/resources/:projectId/:pageReportId"
            element={
              user ? (
                <RequireProject>
                  <Resources />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/export/:projectId"
            element={
              user ? (
                <RequireProject>
                  <Export />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/crawl/live/:projectId"
            element={
              user ? (
                <RequireProject>
                  <CrawlLive />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/site-structure/:projectId"
            element={
              user ? (
                <RequireProject>
                  <SiteStructure />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route
            path="/account"
            element={
              user ? (
                <RequireProject>
                  <Account />
                </RequireProject>
              ) : (
                <Navigate to="/signin" />
              )
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
