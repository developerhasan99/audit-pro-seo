import { Zap } from "lucide-react";

interface FullPageLoaderProps {
  text?: string;
}

export default function FullPageLoader({
  text = "Loading...",
}: FullPageLoaderProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600 animate-pulse" />
          </div>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] animate-pulse">
          {text}
        </p>
      </div>
    </div>
  );
}
