import { useParams } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import Layout from '../../components/Layout/Layout';
import { useEffect } from 'react';

export default function Export() {
  const { projectId } = useParams<{ projectId: string }>();
  const { currentProject, fetchProject } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      fetchProject(parseInt(projectId));
    }
  }, [projectId, fetchProject]);

  const handleExport = (type: string) => {
    window.open(`/api/export/${type}/${projectId}`, '_blank');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Export Data</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{currentProject?.url}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CSV Export */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              CSV Export
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Export all page reports as a CSV file for analysis in Excel or other tools.
            </p>
            <button
              onClick={() => handleExport('csv')}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Download CSV
            </button>
          </div>

          {/* Sitemap Export */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Sitemap Export
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Generate a sitemap.xml file from all crawled URLs with 200 status codes.
            </p>
            <button
              onClick={() => handleExport('sitemap')}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Download Sitemap
            </button>
          </div>

          {/* Resources Export */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Resources Export
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Export images, scripts, styles, and other resources found during the crawl.
            </p>
            <button
              onClick={() => handleExport('resources')}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Download Resources
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
