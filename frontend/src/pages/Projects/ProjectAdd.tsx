import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProjectStore } from '../../store/projectStore';
import Layout from '../../components/Layout/Layout';
import { 
  Globe, 
  Shield, 
  Search, 
  Network, 
  Info, 
  ChevronLeft, 
  Plus, 
  Zap, 
  Settings,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Switch } from '../../components/ui/Switch';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/Card';

export default function ProjectAdd() {
  const navigate = useNavigate();
  const { createProject, loading, error, clearError } = useProjectStore();
  
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
      navigate('/projects');
    } catch (error) {
      // Error handled by store
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const settings = [
    { id: 'crawlSitemap', label: 'Crawl Sitemap', description: 'Include URLs from sitemap.xml', icon: Network },
    { id: 'ignoreRobotstxt', label: 'Ignore robots.txt', description: 'Crawl even if blocked', icon: Shield },
    { id: 'followNofollow', label: 'Follow nofollow', description: 'Crawl links without authority', icon: Search },
    { id: 'includeNoindex', label: 'Include noindex', description: 'Process pages with noindex tag', icon: Globe },
    { id: 'allowSubdomains', label: 'Allow Subdomains', description: 'Crawl across domains', icon: Network },
    { id: 'checkExternalLinks', label: 'Check External', description: 'Verify outbound links', icon: Info },
  ];

  return (
    <Layout title="New Project">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6 bg-slate-50/30">
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Link 
            to="/projects" 
            className="inline-flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-8 group"
            onClick={() => clearError()}
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase tracking-widest text-[11px]">Back to Projects</span>
          </Link>

          <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden bg-white">
            <CardHeader className="relative p-12 pb-0 border-none">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center rotate-3 shadow-2xl shadow-primary/20">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Add Website</CardTitle>
                  <CardDescription className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                    Configure your audit intelligence
                  </CardDescription>
                </div>
              </div>
              <div className="absolute top-12 right-12">
                <Sparkles className="w-8 h-8 text-primary/10 animate-pulse" />
              </div>
            </CardHeader>
            
            <CardContent className="p-12 pt-10">
              <form onSubmit={handleSubmit} id="add-project-form" className="space-y-12">
                {error && (
                  <div className="p-5 bg-red-50 border border-red-100 rounded-[1.5rem] text-red-600 text-[13px] font-black flex items-center space-x-4 animate-in slide-in-from-top-2">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <Label htmlFor="url" className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Target Website Entry URL
                    </Label>
                    <span className="text-[9px] font-black text-primary uppercase bg-primary/10 px-3 py-1 rounded-full tracking-widest">Required</span>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none sticky">
                      <Globe className="h-6 w-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                      id="url"
                      type="url"
                      required
                      placeholder="https://example.com"
                      value={formData.url}
                      onChange={(e) => handleChange('url', e.target.value)}
                      className="h-24 pl-16 pr-8 bg-slate-50 border-none focus-visible:ring-offset-0 focus-visible:ring-[12px] focus-visible:ring-primary/5 rounded-[2rem] text-2xl font-black transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                   <div className="flex items-center space-x-3 px-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">
                      Audit Engine Configuration
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {settings.map((item) => (
                      <div 
                        key={item.id} 
                        className="relative flex items-center justify-between p-6 bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white rounded-[2rem] transition-all cursor-pointer group"
                        onClick={() => handleChange(item.id, !(formData as any)[item.id])}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-primary/20 transition-colors">
                            <item.icon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <Label 
                              htmlFor={item.id} 
                              className="text-[13px] font-black text-slate-900 cursor-pointer block leading-none mb-1.5"
                            >
                              {item.label}
                            </Label>
                            <p className="text-[10px] text-slate-400 font-bold leading-tight">{item.description}</p>
                          </div>
                        </div>
                        <Switch 
                          id={item.id} 
                          checked={(formData as any)[item.id]} 
                          onCheckedChange={(checked) => handleChange(item.id, checked)}
                          className="data-[state=checked]:bg-primary"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter className="p-12 pt-0 flex flex-col items-stretch">
              <Button 
                form="add-project-form"
                type="submit" 
                disabled={loading}
                className="w-full h-24 bg-slate-900 hover:bg-black text-white rounded-[2rem] text-xl font-black shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-4 group overflow-hidden relative"
              >
                <div className="relative z-10 flex items-center space-x-4">
                  {loading ? (
                    <div className="w-7 h-7 border-[5px] border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-2xl group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-white fill-white" />
                    </div>
                  )}
                  <span className="tracking-tight">{loading ? 'Initializing Engine...' : 'Launch Project Audit'}</span>
                </div>
                {!loading && (
                   <div className="absolute right-10 group-hover:translate-x-3 transition-transform duration-300">
                    <ArrowRight className="w-8 h-8 text-white/20" />
                   </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
