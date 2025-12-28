import { useState, useEffect } from 'react';
import { Project, CreateProjectData } from '../../api/projects.api';
import { useProjectStore } from '../../store/projectStore';
import { X, Globe, Shield, Search, Network, Info } from 'lucide-react';

interface ProjectSettingsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectSettingsModal({ project, isOpen, onClose }: ProjectSettingsModalProps) {
  const { updateProject, loading, error, clearError } = useProjectStore();
  const [formData, setFormData] = useState<Partial<CreateProjectData>>({
    url: project.url,
    ignoreRobotstxt: project.ignoreRobotstxt,
    followNofollow: project.followNofollow,
    includeNoindex: project.includeNoindex,
    crawlSitemap: project.crawlSitemap,
    allowSubdomains: project.allowSubdomains,
    checkExternalLinks: project.checkExternalLinks,
    userAgent: project.userAgent || '',
  });

  useEffect(() => {
    if (isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProject(project.id, formData);
      onClose();
    } catch (err) {
      // Error handled by store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900 leading-tight">Project Settings</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Configure {new URL(project.url).hostname}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold flex items-center space-x-3">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                  Website URL
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none sticky">
                    <Globe className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl text-slate-900 font-bold transition-all sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings.map((item) => (
                  <label key={item.id} className="relative flex items-center p-4 bg-slate-50 border border-transparent hover:border-indigo-200 hover:bg-white rounded-2xl cursor-pointer transition-all group">
                    <div className="flex-1 pr-4">
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
                        className="w-5 h-5 text-indigo-600 bg-slate-200 border-none rounded-lg focus:ring-offset-0 focus:ring-indigo-500/20"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-slate-500 font-bold text-sm hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-slate-900 border-2 border-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-black shadow-lg shadow-slate-900/10 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
