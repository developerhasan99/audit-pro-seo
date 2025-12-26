import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import Layout from '../../components/Layout/Layout';
import Loading from '../../components/Common/Loading';

export default function ProjectList() {
  const { projects, loading, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h2>
          <Link
            to="/projects/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add Project
          </Link>
        </div>

        {loading ? (
          <Loading text="Loading projects..." />
        ) : projects.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by creating your first SEO project
            </p>
            <Link
              to="/projects/add"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                  {project.url}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Created: {new Date(project.created!).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link
                    to={`/dashboard/${project.id}`}
                    className="flex-1 text-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  >
                    View Dashboard
                  </Link>
                  <Link
                    to={`/crawl/live/${project.id}`}
                    className="flex-1 text-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Start Crawl
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
