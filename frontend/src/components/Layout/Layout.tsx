import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useUIStore } from "../../store/uiStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  isOnboarding?: boolean;
}

export default function Layout({
  children,
  title = "Dashboard",
  isOnboarding = false,
}: LayoutProps) {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-5xl">{children}</div>
        <footer className="mt-8 text-center text-slate-400 text-xs font-medium">
          <p>© 2024 AuditPro. Premium SEO Analytics Tool.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8">{children}</main>

        <footer className="px-8 py-6 border-t border-slate-200 text-slate-400 text-xs font-medium flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p>© 2024 AuditPro. Premium SEO Analytics Tool.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-600">
              Terms of Service
            </a>
            <a href="#" className="hover:text-slate-600">
              Support
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
