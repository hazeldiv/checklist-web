import { CheckCircle2, X, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  isError?: boolean;
}

export function Toast({ message, isVisible, onClose, duration = 3000, isError = false }: ToastProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => onClose(), duration);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out border border-zinc-800 dark:border-zinc-100",
        isVisible ? "translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-5" : "translate-y-4 opacity-0 animate-out fade-out slide-out-to-bottom-5",
        isError && "border-red-500/50 dark:border-red-500/30"
      )}
    >
      {isError ? (
        <AlertCircle className="w-5 h-5 text-red-500" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-green-400 dark:text-green-600" />
      )}
      <span className={cn("font-semibold tracking-tight", isError && "text-red-100 dark:text-red-600")}>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 p-1 hover:bg-white/10 dark:hover:bg-black/5 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 opacity-50" />
      </button>
    </div>
  );
}
