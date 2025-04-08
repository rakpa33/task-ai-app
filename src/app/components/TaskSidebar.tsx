"use client";

import { useState, useEffect } from "react";
import { Task } from "../types/Task";
import DependencyList from "./DependencyList";

interface TaskSidebarProps {
  task: Task;
  onClose: () => void;
  onUpdate: (id: number, updates: Partial<Task>) => void;
}

export default function TaskSidebar({ task, onClose, onUpdate }: TaskSidebarProps) {
  const [text, setText] = useState(task.text);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [duration, setDuration] = useState(task.duration ?? "");
  const [dependencies, setDependencies] = useState<number[]>(task.dependencies || []);

  useEffect(() => {
    setText(task.text);
    setDueDate(task.dueDate);
    setDuration(task.duration ?? "");
    setDependencies(task.dependencies || []);
  }, [task]);

  const handleSave = () => {
    onUpdate(task.id, {
      text,
      dueDate,
      duration: duration.trim() || null,
      dependencies
    });
    onClose();
  };

  return (
    <aside className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l p-4 overflow-y-auto transition-transform duration-300 z-20">
      <h2 className="text-xl font-bold mb-4">Edit Task</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">Task Name</label>
        <input
          className="p-2 border rounded w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Due Date</label>
        <input
          type="date"
          className="p-2 border rounded w-full"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Duration</label>
        <input
          className="p-2 border rounded w-full"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Dependencies</label>
        {dependencies.length === 0 ? (
          <p className="text-sm text-gray-500">No dependencies.</p>
        ) : (
          <DependencyList dependencies={dependencies} getTaskTextById={(id) => `#${id}`} />
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-black"
        >
          Cancel
        </button>
      </div>
    </aside>
  );
}