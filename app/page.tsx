"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { TodoItem } from "@/components/TodoItem";
import { EmptyState } from "@/components/EmptyState";
import { TodoInput } from "@/components/TodoInput";
import { Toast } from "@/components/Toast";
import { exportToExcel } from "@/lib/utils";
import { Todo, Priority } from "@/types/todo";
import { Download, CheckSquare, Trash2, ShieldAlert } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const PRIORITY_MAP: Record<Priority, number> = {
  urgent: 0,
  normal: 1,
  later: 2,
};

export default function Home() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    message: "",
    isError: false,
  });

  const hideToast = () =>
    setToastConfig((prev) => ({ ...prev, isVisible: false }));

  // Global listeners for Type-to-Focus and Universal Paste
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      const isModifier = e.ctrlKey || e.metaKey || e.altKey;
      const isFunctional = e.key.length > 1 && !["Backspace", "Delete", "Enter"].includes(e.key);

      if (!isModifier && !isFunctional && inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handleGlobalPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      const pastedText = e.clipboardData?.getData("text") || "";
      if (pastedText && inputRef.current) {
        e.preventDefault();
        // Validation: Limit to 500 characters
        const truncatedText = pastedText.slice(0, 500);
        
        inputRef.current.focus();
        setText((prev) => prev + truncatedText);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    window.addEventListener("paste", handleGlobalPaste);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
      window.removeEventListener("paste", handleGlobalPaste);
    };
  }, []);

  const addTodo = (textToAdd: string, priorityToAdd: Priority) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: textToAdd,
      completed: false,
      priority: priorityToAdd,
      createdAt: Date.now(),
    };
    setTodos([...todos, newTodo]);
    setToastConfig({
      isVisible: true,
      message: "Task added successfully!",
      isError: false,
    });
  };

  const handleEmpty = () => {
    setToastConfig({
      isVisible: true,
      message: "Please enter a task before adding.",
      isError: true,
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const deleteTodo = (id: string) => setTodos(todos.filter((t) => t.id !== id));

  const clearAll = () => {
    setTodos([]);
    setShowClearConfirm(false);
  };

  const handleExport = () => {
    if (todos.length === 0) return;

    const priorityMap: Record<Priority, number> = {
      urgent: 0,
      normal: 1,
      later: 2,
    };

    const sortedForExport = [...todos].sort((a, b) => {
      if (a.completed === b.completed) {
        if (a.priority !== b.priority)
          return priorityMap[a.priority] - priorityMap[b.priority];
        return a.createdAt - b.createdAt;
      }
      return a.completed ? 1 : -1;
    });

    const exportData = sortedForExport.map((todo) => ({
      Task: todo.text,
      check: todo.completed ? "✓" : "",
    }));

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T]/g, "")
      .split(".")[0];
    exportToExcel(exportData, `checklist-${timestamp}.xlsx`);
  };

  const sortedTodos = useMemo(() => {
    const priorityMap: Record<Priority, number> = {
      urgent: 0,
      normal: 1,
      later: 2,
    };

    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.priority !== b.priority)
        return priorityMap[a.priority] - priorityMap[b.priority];
      return a.createdAt - b.createdAt;
    });
  }, [todos]);

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="h-screen bg-zinc-50 dark:bg-black font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-black overflow-hidden leading-snug">
      <main className="h-full flex flex-col max-w-2xl mx-auto px-4 sm:px-6 py-2 sm:py-6 lg:py-8">
        {/* Header Section - Horizontal even on mobile */}
        <header className="flex items-start justify-between gap-2 sm:gap-4 mb-6 flex-shrink-0">
          <div className="space-y-0.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 text-zinc-900 dark:text-zinc-50">
              <div className="bg-zinc-900 dark:bg-white p-1.5 rounded-xl text-white dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none flex-shrink-0">
                <CheckSquare className="w-5.5 h-5.5 sm:w-7 sm:h-7" />
              </div>
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight leading-none truncate">
                The Checklisted
              </h1>
            </div>
            <p className="text-[10px] sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium truncate">
              {todos.length > 0
                ? `${completedCount} of ${todos.length} tasks`
                : "Organize your tasks."}
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {todos.length > 0 && (
              <>
                <button
                  onClick={handleExport}
                  title="Export to Excel"
                  className="flex items-center justify-center p-2.5 text-zinc-600 dark:text-zinc-400 hover:text-green-600 dark:hover:text-green-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all hover:shadow-md active:scale-95 shadow-sm"
                >
                  <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
                {showClearConfirm ? (
                  <button
                    onClick={clearAll}
                    onMouseLeave={() => setShowClearConfirm(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-[10px] sm:text-xs font-bold text-white bg-red-500 rounded-2xl shadow-lg animate-in slide-in-from-right-4 duration-200"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Confirm Clear</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    title="Clear All"
                    className="flex items-center justify-center p-2.5 text-zinc-400 hover:text-red-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl transition-all hover:shadow-md active:scale-95 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>
                )}
              </>
            )}
          </div>
        </header>

        <div className="mb-6 flex-shrink-0">
          <TodoInput 
            ref={inputRef}
            text={text}
            setText={setText}
            priority={priority}
            setPriority={setPriority}
            onAdd={addTodo} 
            onEmpty={handleEmpty} 
          />
        </div>

        {/* List Section */}
        <div className="space-y-2.5 flex-grow overflow-y-auto pr-2 -mr-2 scrollbar-thin px-0.5">
          {sortedTodos.length > 0 ? (
            sortedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <EmptyState />
            </div>
          )}
        </div>

        {/* Footer info */}
        <footer className="mt-4 pb-4 border-t border-zinc-100 dark:border-zinc-900 pt-4 flex flex-col items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-widest font-bold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Stored Locally
            </span>
          </div>
          <p className="text-[10px] text-zinc-300 dark:text-zinc-700 font-bold uppercase tracking-wider">
            v1.0
          </p>
        </footer>
      </main>

      {/* Toast Notification */}
      <Toast
        isVisible={toastConfig.isVisible}
        onClose={hideToast}
        message={toastConfig.message}
        isError={toastConfig.isError}
      />
    </div>
  );
}
