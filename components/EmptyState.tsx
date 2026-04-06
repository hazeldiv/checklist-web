import { ClipboardList } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-2xl mb-4">
        <ClipboardList className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
      </div>
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">
        Your list is empty
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
        Add your first task above to get started. Everything is saved locally.
      </p>
    </div>
  );
}
