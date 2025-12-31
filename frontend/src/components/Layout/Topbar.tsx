import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { Bell, Search, Menu, LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  title: string;
  onMenuClick?: () => void;
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-[10px] md:text-sm font-bold text-slate-600 uppercase tracking-widest truncate max-w-[150px] md:max-w-none">
          {title}
        </h2>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <div className="hidden xl:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 space-x-2 border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search report..."
            className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 w-48"
          />
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-3 pl-2 md:pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity"
            >
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-xs font-bold text-slate-900">
                  {user?.email?.split("@")[0]}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Project Manager
                </span>
              </div>
              <div className="w-8 h-8 md:w-9 md:h-9 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs md:text-sm border border-indigo-200 shadow-sm">
                {user?.email?.substring(0, 2).toUpperCase()}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 z-50">
                <div className="px-3 py-2 border-b border-slate-50 mb-1">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {user?.email}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Basic Plan
                  </p>
                </div>

                <button
                  onClick={() => navigate("/account")}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors mb-1"
                >
                  <User className="w-4 h-4" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
