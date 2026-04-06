"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { Priority } from "@/types/todo";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (text: string, priority: Priority) => void;
}

export function TodoModal({ isOpen, onClose, onAdd }: TodoModalProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAdd = (textToAdd: string, priorityToAdd: Priority) => {
    onAdd(textToAdd, priorityToAdd);
    setText("");
    setPriority("normal");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Add New Task</h2>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm">
          Type your task below and press Enter to save. Add as many as you need!
        </p>
        
        <div className="relative">
          <TodoInput 
            text={text}
            setText={setText}
            priority={priority}
            setPriority={setPriority}
            onAdd={handleAdd} 
          />
        </div>
      </div>
    </div>
  );
}
