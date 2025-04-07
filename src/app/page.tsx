"use client";

import { useEffect, useState } from "react";

///////////////////////////////////////////////////////////
// 🔹 Type Definitions
///////////////////////////////////////////////////////////

type Task = {
  id: number;
  text: string;
  dueDate: string;
  duration: string; // e.g. "45 minutes"
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
  const [aiLoading, setAiLoading] = useState(false);

const generateTaskFromPrompt = async () => {
  const userPrompt = prompt("What do you want to do?");
  if (!userPrompt) return;

  setAiLoading(true);
  try {
    const res = await fetch('/api/generate-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    const data = await res.json();

    if (data.result) {
      setInput(data.result); // or you could parse into text/duration/date
    }
  } catch (err) {
    console.error(err);
  } finally {
    setAiLoading(false);
  }
};


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
  // 🔸 Handlers: Add / Toggle / Delete Tasks
  ///////////////////////////////////////////////////////////

  // Validate duration before adding task
  const isValidDuration = (input: string): boolean => {
    const trimmed = input.trim().toLowerCase();

    // Match patterns like: 30m, 1h, 1.5h, 2h 30m
    const regex = /^(\d+(\.\d+)?h)?\s*(\d+m)?$/;

    return regex.test(trimmed) && trimmed.length > 0;
  };

  const addTask = () => {
    if (!input.trim()) return;

    if (duration && !isValidDuration(duration)) {
      setDurationError(
        "Please enter a valid duration (e.g., 45m, 1h, 1.5h, 2h 30m)"
      );
      return;
    } else {
      setDurationError(""); // clear error on valid entry
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

  // Toggle task complete/incomplete
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  ///////////////////////////////////////////////////////////
  // 🔸 Render
  ///////////////////////////////////////////////////////////

  return (
    <div className="bg-white text-black min-h-screen w-full">
      <main className="flex flex-col items-center p-4 w-full max-w-2xl mx-auto">
        {/* 📝 Header */}
        <h1 className="text-3xl font-bold mb-4">📝 Task List</h1>

        <button
  className="mb-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
  onClick={generateTaskFromPrompt}
  disabled={aiLoading}
>
  {aiLoading ? 'Thinking...' : '🪄 Generate Task with AI'}
</button>

        {/* 🧾 Task Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] w-full gap-2 mb-4">
          
          {/* Task Description */}
          <input
            className="p-2 border rounded text-black w-full"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a task..."
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />

          {/* Due Date */}
          <input
            className="p-2 border rounded text-black w-full"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* Duration */}
          <input
            className={`p-2 border rounded w-full text-black ${
              durationError ? "border-red-500" : "border-gray-300"
            }`}
            type="text"
            value={duration}
            onChange={(e) => {
              const value = e.target.value;
              setDuration(value);

              // Only show error if there's a value AND it's invalid
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

          {/* Duration Error Message */}
          {durationError && (
            <p className="text-sm text-red-500 col-span-full">
              {durationError}
            </p>
          )}

          {/* Add Button */}
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
              {/* Task Info */}
              <div className="flex items-center gap-2 flex-1">
                {/* Completion Checkbox */}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="w-5 h-5 cursor-pointer"
                />

                {/* Task Text + Meta */}
                <div>
                  <p
                    className={`${
                      task.completed ? "line-through" : ""
                    } text-black`}
                  >
                    {task.text}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {task.dueDate} | Duration: {task.duration}
                  </p>
                </div>
              </div>

              {/* Delete Button */}
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
