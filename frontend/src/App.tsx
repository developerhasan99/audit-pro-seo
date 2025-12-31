import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./store/authStore";

// Pages
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import ProjectList from "./pages/Projects/ProjectList";
import ProjectAdd from "./pages/Projects/ProjectAdd";
import Issues from "./pages/Issues/Issues";
import IssuesView from "./pages/Issues/IssuesView";
import Explorer from "./pages/Explorer/Explorer";
import Resources from "./pages/Resources/Resources";
import Export from "./pages/Export/Export";
import CrawlLive from "./pages/CrawlLive/CrawlLive";
import Account from "./pages/Account/Account";

import Home from "./pages/Home/Home";
import { useProjectStore } from "./store/projectStore";

// Wrapper to require at least one project
function RequireProject({ children }: { children: JSX.Element }) {
  const { projects, loading, fetchProjects } = useProjectStore();
  const { user } = useAuthStore();

  // Use ref to track if multiple fetches have triggered
  // Ideally this should be handled better, but simplistically:
  useEffect(() => {
    if (user && projects.length === 0) {
      fetchProjects();
    }
  }, [user, fetchProjects, projects.length]);

  if (projects.length === 0 && !loading) {
    return <Navigate to="/projects/add" />;
  }

  return children;
}

function App() {
  const { user, initialized, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
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
                <Home />
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
  );
}

export default App;
