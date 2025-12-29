import { Link, useLocation } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  Network,
  ClipboardList,
  Settings,
  ShieldCheck,
  Zap,
  ChevronRight,
  X,
  Download,
} from "lucide-react";
import ProjectSelector from "../Sidebar/ProjectSelector";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { selectedProjectId } = useProjectStore();
  const projectIdStr = selectedProjectId?.toString();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const navGroups = [
    {
      title: "Dashboard",
      items: [
        {
          name: "Overview",
          icon: LayoutDashboard,
          path: projectIdStr ? `/dashboard/${projectIdStr}` : "/",
        },
        {
          name: "New Audit",
          icon: PlusCircle,
          path: projectIdStr ? `/crawl/live/${projectIdStr}` : "/",
        },
      ],
    },
    {
      title: "Reports",
      items: [
        {
          name: "Issues Explorer",
          icon: ShieldCheck,
          path: projectIdStr ? `/issues/${projectIdStr}` : "#",
        },
        {
          name: "Data Explorer",
          icon: Search,
          path: projectIdStr ? `/explorer/${projectIdStr}` : "#",
        },
        { name: "Site Structure", icon: Network, path: "#" },
        {
          name: "Export Data",
          icon: Download,
          path: `/export/${projectIdStr}`,
        },
      ],
    },
    {
      title: "Maintenance",
      items: [
        { name: "Crawl Logs", icon: ClipboardList, path: "#" },
        { name: "Settings", icon: Settings, path: "/account" },
      ],
    },
  ];

  return (
    <aside
      className={`
      w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
    `}
    >
      {/* Brand & Close Button */}
      <div className="p-8 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center font-black text-white shadow-xl rotate-3">
            A
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            AuditPro
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Project Selector */}
      <ProjectSelector onClose={onClose} />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-4 py-2 mt-4 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className={`
                      w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${
                        active
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0">
                        <item.icon className="w-5 h-5" />
                      </span>
                      <span className="font-semibold text-sm">{item.name}</span>
                    </div>
                    {active && <ChevronRight className="w-3 h-3 opacity-50" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Plan Card */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-indigo-600/10 rounded-xl p-4 border border-indigo-500/20">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">
              Plan: Pro
            </span>
            <span className="text-xs text-slate-500 font-bold">1.2GB/10GB</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div className="bg-indigo-500 h-full w-[12%]"></div>
          </div>
          <button className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-2">
            <Zap className="w-3 h-3" />
            <span>Upgrade Plan</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
