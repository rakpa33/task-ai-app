"use client";

import { useEffect, useState } from "react";
import AiSidebar from '../components/AiSidebar';

///////////////////////////////////////////////////////////
// 🔹 Type Definitions
///////////////////////////////////////////////////////////

type Task = {
  id: number;
  text: string;
  dueDate: string;
  duration: string;
  completed: boolean;
};

///////////////////////////////////////////////////////////
// 🔹 Main Component
///////////////////////////////////////////////////////////

export default function Home() {
  ///////////////////////////////////////////////////////////
  // 🔸 State Variables
  ///////////////////////////////////////////////////////////

  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [duration, setDuration] = useState("");
  const [durationError, setDurationError] = useState("");
  const [editingField, setEditingField] = useState<{ id: number; field: keyof Task; originalValue: string } | null>(null);

  ///////////////////////////////////////////////////////////
  // 🔸 Effect: Load tasks from localStorage on mount
  ///////////////////////////////////////////////////////////

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  ///////////////////////////////////////////////////////////
  // 🔸 Effect: Save tasks to localStorage when they change
  ///////////////////////////////////////////////////////////

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  ///////////////////////////////////////////////////////////
  // 🔸 Helpers
  ///////////////////////////////////////////////////////////

  const isValidDuration = (input: string): boolean => {
    const trimmed = input.trim().toLowerCase();
    const regex = /^((\d+(\.\d+)?h)?\s*(\d+m)?)$/;
    return regex.test(trimmed) && trimmed.length > 0;
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const handleKeyEvents = (e: React.KeyboardEvent<HTMLInputElement>, task: Task, field: keyof Task) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      if (editingField) {
        updateTask(task.id, { [field]: editingField.originalValue });
      }
      setEditingField(null);
    }
  };

  ///////////////////////////////////////////////////////////
  // 🔸 Handlers: Add / Toggle / Delete Tasks
  ///////////////////////////////////////////////////////////

  const addTask = () => {
    if (!input.trim()) return;

    if (duration && !isValidDuration(duration)) {
      setDurationError(
        "Please enter a valid duration (e.g., 45m, 1h, 1.5h, 2h 30m)"
      );
      return;
    } else {
      setDurationError("");
    }

    const newTask: Task = {
      id: Date.now(),
      text: input,
      dueDate: dueDate || "No date",
      duration: duration || "No duration",
      completed: false,
    };

    setTasks([newTask, ...tasks]);
    setInput("");
    setDueDate("");
    setDuration("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  ///////////////////////////////////////////////////////////
  // 🔸 Render
  ///////////////////////////////////////////////////////////

  return (
    <div className="bg-white text-black min-h-screen w-full flex flex-col md:flex-row">
      <AiSidebar
        onAddTasks={(taskTexts) => {
          const newTasks = taskTexts.map((text) => ({
            id: Date.now() + Math.random(),
            text,
            dueDate: 'No date',
            duration: 'No duration',
            completed: false,
          }));
          setTasks((prev) => [...newTasks, ...prev]);
        }}
      />

      <main className="w-full md:w-2/3 p-4">
        <h1 className="text-3xl font-bold mb-4">📝 Task List</h1>

        {/* 🧾 Task Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] w-full gap-2 mb-4">
          <input
            className="p-2 border rounded text-black w-full"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task..."
            onKeyDown={(e) => e.key === "Enter" && addTask()}
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
            onChange={(e) => {
              const value = e.target.value;
              setDuration(value);
              if (value.trim() && !isValidDuration(value)) {
                setDurationError(
                  "Please enter a valid duration (e.g., 45m, 1h, 1.5h, 2h 30m)"
                );
              } else {
                setDurationError("");
              }
            }}
            placeholder="Duration (e.g. 45m or 1.5h)"
          />
          {durationError && (
            <p className="text-sm text-red-500 col-span-full">
              {durationError}
            </p>
          )}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
            onClick={addTask}
          >
            Add
          </button>
        </div>

        {/* ✅ Task List */}
        <ul className="w-full space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center justify-between p-2 border rounded ${
                task.completed ? "bg-green-100" : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 cursor-pointer"
                />

                {/* Inline Editable Fields */}
                <div className="flex flex-col gap-1">
                  {/* Text Field */}
                  {editingField?.id === task.id && editingField.field === 'text' ? (
                    <input
                      type="text"
                      value={task.text}
                      onChange={(e) => updateTask(task.id, { text: e.target.value })}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => handleKeyEvents(e, task, 'text')}
                      autoFocus
                      className="p-1 border rounded text-black"
                    />
                  ) : (
                    <p
                      onClick={() => setEditingField({ id: task.id, field: 'text', originalValue: task.text })}
                      className="cursor-pointer"
                    >
                      {task.text}
                    </p>
                  )}

                  {/* Due Date Field */}
                  {editingField?.id === task.id && editingField.field === 'dueDate' ? (
                    <input
                      type="date"
                      value={task.dueDate}
                      onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => handleKeyEvents(e, task, 'dueDate')}
                      autoFocus
                      className="p-1 border rounded text-black"
                    />
                  ) : (
                    <p
                      onClick={() => setEditingField({ id: task.id, field: 'dueDate', originalValue: task.dueDate })}
                      className="cursor-pointer text-sm text-gray-500"
                    >
                      Due: {task.dueDate}
                    </p>
                  )}

                  {/* Duration Field */}
                  {editingField?.id === task.id && editingField.field === 'duration' ? (
                    <input
                      type="text"
                      value={task.duration}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!value || isValidDuration(value)) {
                          updateTask(task.id, { duration: value });
                        }
                      }}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => handleKeyEvents(e, task, 'duration')}
                      autoFocus
                      className="p-1 border rounded text-black"
                    />
                  ) : (
                    <p
                      onClick={() => setEditingField({ id: task.id, field: 'duration', originalValue: task.duration })}
                      className="cursor-pointer text-sm text-gray-500"
                    >
                      Duration: {task.duration}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}