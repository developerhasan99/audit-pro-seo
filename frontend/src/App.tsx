import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import ProjectList from './pages/Projects/ProjectList';
import ProjectAdd from './pages/Projects/ProjectAdd';
import Issues from './pages/Issues/Issues';
import IssuesView from './pages/Issues/IssuesView';
import Explorer from './pages/Explorer/Explorer';
import Resources from './pages/Resources/Resources';
import Export from './pages/Export/Export';
import CrawlLive from './pages/CrawlLive/CrawlLive';
import Account from './pages/Account/Account';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={!user ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/" />} />

        {/* Protected routes */}
        <Route path="/" element={user ? <ProjectList /> : <Navigate to="/signin" />} />
        <Route path="/projects/add" element={user ? <ProjectAdd /> : <Navigate to="/signin" />} />
        <Route path="/dashboard/:projectId" element={user ? <Dashboard /> : <Navigate to="/signin" />} />
        <Route path="/issues/:projectId" element={user ? <Issues /> : <Navigate to="/signin" />} />
        <Route path="/issues/:projectId/view" element={user ? <IssuesView /> : <Navigate to="/signin" />} />
        <Route path="/explorer/:projectId" element={user ? <Explorer /> : <Navigate to="/signin" />} />
        <Route path="/resources/:projectId/:pageReportId" element={user ? <Resources /> : <Navigate to="/signin" />} />
        <Route path="/export/:projectId" element={user ? <Export /> : <Navigate to="/signin" />} />
        <Route path="/crawl/live/:projectId" element={user ? <CrawlLive /> : <Navigate to="/signin" />} />
        <Route path="/account" element={user ? <Account /> : <Navigate to="/signin" />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
