import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import Layout from '../../components/Layout/Layout';
import { Globe, Shield, Search, Network, Info, ChevronLeft, Plus, Zap } from 'lucide-react';

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
      // Error handled by store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const settings = [
    { id: 'crawlSitemap', label: 'Crawl Sitemap', description: 'Include URLs from sitemap.xml', icon: Network },
    { id: 'ignoreRobotstxt', label: 'Ignore robots.txt', description: 'Crawl even if blocked by robots.txt', icon: Shield },
    { id: 'followNofollow', label: 'Follow nofollow', description: 'Crawl links marked as nofollow', icon: Search },
    { id: 'includeNoindex', label: 'Include noindex', description: 'Process pages with noindex tag', icon: Globe },
    { id: 'allowSubdomains', label: 'Allow Subdomains', description: 'Crawl subdomains of main domain', icon: Network },
    { id: 'checkExternalLinks', label: 'Check External', description: 'Verify external outbound links', icon: Info },
  ];

  return (
    <Layout title="Add New Project">
      <div className="p-4 md:p-8 max-w-4xl">
        <div className="mb-8">
          <Link 
            to="/projects" 
            className="inline-flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-widest">Back to Projects</span>
          </Link>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-4">Create New Project</h2>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Start a new website analysis and monitoring project</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center space-x-3">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>{error}</span>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Website URL
            </label>
            <div className="relative group max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none sticky">
                <Globe className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="url"
                name="url"
                required
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleChange}
                className="block w-full pl-12 pr-6 py-4 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/10 rounded-2xl text-slate-900 font-bold transition-all text-base"
              />
            </div>
            <p className="mt-3 text-xs text-slate-400 font-bold">Ensure the URL includes http:// or https://</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              <span>Advanced Crawl Configuration</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.map((item) => (
                <label key={item.id} className="relative flex items-center p-5 bg-slate-50 border border-transparent hover:border-indigo-200 hover:bg-white rounded-2xl cursor-pointer transition-all group">
                  <div className="flex-1 pr-6">
                    <div className="flex items-center space-x-2 mb-1">
                      <item.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-sm font-black text-slate-800 tracking-tight">{item.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.description}</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={item.id}
                      checked={!!(formData as any)[item.id]}
                      onChange={handleChange}
                      className="w-6 h-6 text-indigo-600 bg-white border-2 border-slate-200 rounded-lg focus:ring-offset-0 focus:ring-indigo-500/20"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 max-w-xs flex items-center justify-center space-x-3 py-4 bg-slate-900 text-white rounded-2xl text-base font-black shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              <span>{loading ? 'Creating...' : 'Create Project'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-8 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-12 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start space-x-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-black text-indigo-900 mb-1">Quick Tip</h4>
            <p className="text-xs text-indigo-700/80 font-bold leading-relaxed">
              Once created, you can land directly on your dashboard. We'll automatically suggest starting a crawl if no data is present. Performance reports typically take 2-5 minutes depending on site size.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
