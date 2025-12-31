import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";
import Layout from "../../components/Layout/Layout";
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
  Sparkles,
} from "lucide-react";
import { CustomSwitch } from "../../components/Common/CustomSwitch";

export default function ProjectAdd() {
  const navigate = useNavigate();
  const { createProject, loading, error, clearError, projects, fetchProjects } =
    useProjectStore();

  // Fetch projects on mount to check if this is the first one
  useState(() => {
    if (projects.length === 0) {
      fetchProjects();
    }
  });

  const isFirstProject = projects.length === 0 && !loading;

  const [formData, setFormData] = useState({
    url: "",
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
      navigate("/projects");
    } catch (error) {
      // Error handled by store
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const settings = [
    {
      id: "crawlSitemap",
      label: "Crawl Sitemap",
      description: "Include URLs from sitemap.xml",
      icon: Network,
    },
    {
      id: "ignoreRobotstxt",
      label: "Ignore robots.txt",
      description: "Crawl even if blocked",
      icon: Shield,
    },
    {
      id: "followNofollow",
      label: "Follow nofollow",
      description: "Crawl links without authority",
      icon: Search,
    },
    {
      id: "includeNoindex",
      label: "Include noindex",
      description: "Process pages with noindex tag",
      icon: Globe,
    },
    {
      id: "allowSubdomains",
      label: "Allow Subdomains",
      description: "Crawl across domains",
      icon: Network,
    },
    {
      id: "checkExternalLinks",
      label: "Check External",
      description: "Verify outbound links",
      icon: Info,
    },
  ];

  return (
    <Layout title="New Project" isOnboarding={isFirstProject}>
      <div
        className={`flex flex-col items-center justify-center ${isFirstProject ? "" : "min-h-[calc(100vh-80px)]"} bg-slate-50/30`}
      >
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          {!isFirstProject && (
            <Link
              to="/projects"
              className="inline-flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-6 group"
              onClick={() => clearError()}
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="uppercase tracking-widest text-[11px]">
                Back to Projects
              </span>
            </Link>
          )}

          {/* Custom Card Implementation */}
          <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-xl">
            <div className="relative flex items-center gap-6 justify-left">
              <div className="size-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 rotate-6 -mt-2">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-3">
                  {isFirstProject ? "Welcome to AuditPro" : "Add Project"}
                </h2>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                  {isFirstProject
                    ? "Add your first project to continue."
                    : "Configure your audit intelligence"}
                </p>
              </div>
              <div className="absolute top-2 right- 2">
                <Sparkles className="w-8 h-8 text-indigo-500/10 animate-pulse" />
              </div>
            </div>

            <div className="py-10">
              <form
                onSubmit={handleSubmit}
                id="add-project-form"
                className="space-y-8"
              >
                {error && (
                  <div className="p-5 bg-red-50 border border-red-100 rounded-[1.5rem] text-red-600 text-[13px] font-black flex items-center space-x-4 animate-in slide-in-from-top-2">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <label
                      htmlFor="url"
                      className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]"
                    >
                      Target Website Entry URL
                    </label>
                    <span className="text-[9px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full tracking-widest">
                      Required
                    </span>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                      <Globe className="h-6 w-6 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      id="url"
                      type="url"
                      required
                      placeholder="https://example.com"
                      value={formData.url}
                      onChange={(e) => handleChange("url", e.target.value)}
                      className="w-full px-5 py-4 pl-12 border-2 border-slate-100 rounded-xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 outline-none transition-all text-base font-semibold bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-3 px-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">
                      Audit Engine Configuration
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {settings.map((item) => (
                      <div
                        key={item.id}
                        className="relative flex items-center justify-between p-4 bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white rounded-2xl transition-all cursor-pointer group"
                        onClick={() =>
                          handleChange(item.id, !(formData as any)[item.id])
                        }
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:border-indigo-100 transition-colors">
                            <item.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-black text-slate-900 cursor-pointer block leading-none mb-1.5">
                              {item.label}
                            </span>
                            <p className="text-[10px] text-slate-400 font-bold leading-tight">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <CustomSwitch
                          checked={(formData as any)[item.id]}
                          onChange={(checked) => handleChange(item.id, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <button
              form="add-project-form"
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] group"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
              )}
              <span className="tracking-tight uppercase text-sm tracking-[0.1em]">
                {loading ? "Adding project..." : "Add Project"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
