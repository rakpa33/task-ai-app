"use client";

import { useState } from "react";
import { formatDuration } from "../utils/formatDuration";

interface TaskFormProps {
  onAddTask: (task: { text: string; dueDate: string; duration: string | null }) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [duration, setDuration] = useState("");
  const [durationError, setDurationError] = useState("");

  const handleSubmit = () => {
    const formatted = duration ? formatDuration(duration) : null;
    if (duration && formatted === null) {
      setDurationError("Duration must be at least 5 minutes and valid (e.g., 1h 30m)");
      return;
    }
    setDurationError("");
    onAddTask({ text: input, dueDate: dueDate || "No date", duration: formatted });
    setInput("");
    setDueDate("");
    setDuration("");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] w-full gap-2 mb-4">
      <input
        className="p-2 border rounded text-black w-full"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a task..."
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <input
        className="p-2 border rounded text-black w-full"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <input
        className={`p-2 border rounded w-full text-black ${
          durationError ? "border-red-500" : "border-gray-300"
        }`}
        type="text"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Duration (e.g. 45m or 1.5h)"
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
        onClick={handleSubmit}
      >
        Add
      </button>
    </div>
  );
}