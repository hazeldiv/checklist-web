"use client";

import { Trash2, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.005] hover:border-zinc-300 dark:hover:border-zinc-700",
        todo.completed && "opacity-60 bg-zinc-50/50 dark:bg-zinc-900/50 grayscale-[0.2] shadow-sm"
      )}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <button
          onClick={() => onToggle(todo.id)}
          className={cn(
            "flex-shrink-0 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600",
            todo.completed ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400"
          )}
        >
          {todo.completed ? (
            <CheckCircle className="w-5.5 h-5.5 fill-zinc-100 dark:fill-zinc-800" />
          ) : (
            <Circle className="w-5.5 h-5.5" />
          )}
        </button>
        <span
          className={cn(
            "text-sm sm:text-base text-zinc-900 dark:text-zinc-100 break-words transition-all",
            todo.completed && "line-through text-zinc-400 dark:text-zinc-600"
          )}
        >
          {todo.text}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
        {/* Priority Badge - Moved and Styled */}
        {!todo.completed && (
          <span
            className={cn(
              "w-[52px] sm:w-[60px] py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full whitespace-nowrap text-center inline-block",
              todo.priority === "urgent" && "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-900",
              todo.priority === "normal" && "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-600",
              todo.priority === "later" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
            )}
          >
            {todo.priority}
          </span>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <Trash2 className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
