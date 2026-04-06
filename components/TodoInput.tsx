import { FormEvent, forwardRef } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Priority } from "@/types/todo";

interface TodoInputProps {
  text: string;
  setText: (text: string) => void;
  priority: Priority;
  setPriority: (priority: Priority) => void;
  onAdd: (text: string, priority: Priority) => void;
  onEmpty?: () => void;
}

export const TodoInput = forwardRef<HTMLInputElement, TodoInputProps>(
  ({ text, setText, priority, setPriority, onAdd, onEmpty }, ref) => {
    const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (text.trim()) {
        onAdd(text.trim(), priority);
        setText("");
        setPriority("normal");
      } else {
        onEmpty?.();
      }
    };

    const priorityOptions: { value: Priority; label: string; color: string }[] = [
      { value: "urgent", label: "Urgent", color: "bg-red-500 text-white" },
      { value: "normal", label: "Normal", color: "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900" },
      { value: "later", label: "Later", color: "bg-amber-500 text-white" },
    ];

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 gap-y-2.5">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPriority(option.value)}
              className={cn(
                "w-18 sm:w-20 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 text-center",
                priority === option.value
                  ? option.color + " shadow-md scale-105"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative flex items-center w-full gap-2 transition-all duration-300 ease-in-out focus-within:scale-[1.01]"
        >
          <input
            ref={ref}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className={cn(
              "flex-1 px-5 py-4 text-base bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            )}
          />
          <button
            type="submit"
            className={cn(
              "p-4 rounded-2xl shadow-lg transition-all cursor-pointer active:scale-95",
              text.trim() 
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-75" 
                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600"
            )}
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>
      </div>
    );
  }
);

TodoInput.displayName = "TodoInput";
