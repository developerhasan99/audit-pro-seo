import { Link, useLocation } from 'react-router-dom';
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
  X
} from 'lucide-react';

interface SidebarProps {
  projectId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ projectId, isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Overview', icon: LayoutDashboard, path: projectId ? `/dashboard/${projectId}` : '/' },
        { name: 'New Audit', icon: PlusCircle, path: projectId ? `/crawl/live/${projectId}` : '/' },
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { name: 'Issues Explorer', icon: ShieldCheck, path: projectId ? `/issues/${projectId}` : '#' },
        { name: 'Data Explorer', icon: Search, path: projectId ? `/explorer/${projectId}` : '#' },
        { name: 'Site Structure', icon: Network, path: '#' },
      ]
    },
    {
      title: 'MAINTENANCE',
      items: [
        { name: 'Crawl Logs', icon: ClipboardList, path: '#' },
        { name: 'Settings', icon: Settings, path: '/account' },
      ]
    }
  ];

  return (
    <div className={`
      w-64 bg-[#1e1b4b] text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo & Close Button */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            A
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AuditPro</span>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
        {navItems.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-slate-500 tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      active 
                        ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-900/20' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
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
      <div className="p-4 m-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan: Pro</span>
          <span className="text-[10px] text-slate-400">1.2GB/10GB</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5 mb-3">
          <div className="bg-blue-500 h-1.5 rounded-full w-[12%]"></div>
        </div>
        <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2">
          <Zap className="w-3 h-3 text-yellow-400" />
          <span>Upgrade Plan</span>
        </button>
      </div>
    </div>
  );
}

