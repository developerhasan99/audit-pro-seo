import { useState, useEffect } from 'react';
import { Project, CreateProjectData } from '../../api/projects.api';
import { useProjectStore } from '../../store/projectStore';
import { X, Globe, Shield, Search, Network, Info } from 'lucide-react';
import { CustomSwitch } from '../../components/Common/CustomSwitch';

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

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
      <div 
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-10 pb-6 border-none">
          <div>
            <h3 className="text-3xl font-black text-slate-900 leading-tight tracking-tight italic">Project Settings</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">
              Modifying: {new URL(project.url).hostname.replace('www.', '')}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-10 pb-10 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-10">
            {error && (
              <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[13px] font-black flex items-center space-x-4 animate-in slide-in-from-top-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Website Entry URL
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none sticky">
                  <Globe className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={(e) => handleChange('url', e.target.value)}
                  className="w-full h-16 pl-14 pr-6 bg-slate-50 border-none focus:bg-white focus:ring-8 focus:ring-indigo-500/5 rounded-2xl text-lg font-black transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-3 ml-1">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">
                  Audit configurations
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings.map((item) => (
                  <div 
                    key={item.id} 
                    className="relative flex items-center justify-between p-5 bg-slate-50 border border-transparent hover:border-indigo-50 hover:bg-white rounded-[1.75rem] cursor-pointer transition-all group"
                    onClick={() => handleChange(item.id, !(formData as any)[item.id])}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-indigo-100 transition-colors">
                        <item.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-900 leading-none mb-1">
                          {item.label}
                        </span>
                        <p className="text-[10px] text-slate-400 font-bold leading-tight line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                    <CustomSwitch 
                      checked={!!(formData as any)[item.id]} 
                      onChange={(checked) => handleChange(item.id, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10 pt-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end space-x-6">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
            >
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-16 px-10 bg-slate-900 border-2 border-slate-900 hover:bg-black text-white rounded-2xl text-base font-black shadow-xl shadow-indigo-100/10 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                'Save Infrastructure Update'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
