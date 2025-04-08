"use client";

import { Task } from "../types/Task";
import { useState } from "react";

interface TaskSidebarProps {
  task: Task;
  onClose: () => void;
  onUpdate: (id: number, updates: Partial<Task>) => void;
}

export default function TaskSidebar({ task, onClose, onUpdate }: TaskSidebarProps) {
  const [localTask, setLocalTask] = useState(task);

  const handleChange = (field: keyof Task, value: string) => {
    setLocalTask((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(localTask.id, localTask);
    onClose();
  };

  return (
    <aside className="absolute right-0 top-0 h-full w-full md:w-1/3 bg-white border-l p-4 shadow-xl transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Task</h2>
        <button onClick={onClose} className="text-red-500 hover:text-red-700 text-lg">✕</button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Description</label>
          <input
            type="text"
            value={localTask.text}
            onChange={(e) => handleChange("text", e.target.value)}
            className="mt-1 block w-full border rounded p-2 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Due Date</label>
          <input
            type="date"
            value={localTask.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            className="mt-1 block w-full border rounded p-2 text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Duration</label>
          <input
            type="text"
            value={localTask.duration || ""}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="mt-1 block w-full border rounded p-2 text-black"
            placeholder="e.g. 1h 30m"
          />
        </div>
        <button
          onClick={handleSave}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </aside>
  );
}