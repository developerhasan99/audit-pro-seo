import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';

export default function ProjectAdd() {
  const navigate = useNavigate();
  const { createProject, loading, error } = useProjectStore();
  
  const [formData, setFormData] = useState({
    url: '',
    ignoreRobotstxt: false,
    followNofollow: false,
    includeNoindex: false,
    crawlSitemap: true,
    allowSubdomains: false,
    checkExternalLinks: false,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await createProject(formData);
      navigate('/');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SEOnaut</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/" className="text-primary-600 hover:text-primary-500">
            ← Back to Projects
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Add New Project
          </h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Website URL *
              </label>
              <input
                type="url"
                id="url"
                name="url"
                required
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Crawl Options
              </h3>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="crawlSitemap"
                    name="crawlSitemap"
                    type="checkbox"
                    checked={formData.crawlSitemap}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="crawlSitemap" className="font-medium text-gray-700 dark:text-gray-300">
                    Crawl Sitemap
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Include URLs from sitemap.xml in the crawl
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="ignoreRobotstxt"
                    name="ignoreRobotstxt"
                    type="checkbox"
                    checked={formData.ignoreRobotstxt}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="ignoreRobotstxt" className="font-medium text-gray-700 dark:text-gray-300">
                    Ignore robots.txt
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Crawl pages even if blocked by robots.txt
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="followNofollow"
                    name="followNofollow"
                    type="checkbox"
                    checked={formData.followNofollow}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="followNofollow" className="font-medium text-gray-700 dark:text-gray-300">
                    Follow nofollow links
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Crawl links marked with rel="nofollow"
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="includeNoindex"
                    name="includeNoindex"
                    type="checkbox"
                    checked={formData.includeNoindex}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="includeNoindex" className="font-medium text-gray-700 dark:text-gray-300">
                    Include noindex pages
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Crawl pages with noindex meta tag
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="allowSubdomains"
                    name="allowSubdomains"
                    type="checkbox"
                    checked={formData.allowSubdomains}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="allowSubdomains" className="font-medium text-gray-700 dark:text-gray-300">
                    Allow subdomains
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Crawl subdomains of the main domain
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="checkExternalLinks"
                    name="checkExternalLinks"
                    type="checkbox"
                    checked={formData.checkExternalLinks}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="checkExternalLinks" className="font-medium text-gray-700 dark:text-gray-300">
                    Check external links
                  </label>
                  <p className="text-gray-500 dark:text-gray-400">
                    Verify external links for broken links
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
              <Link
                to="/"
                className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
