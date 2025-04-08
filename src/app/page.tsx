"use client";

import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import AiSidebar from "./components/AiSidebar";
import { Task } from "./types/Task";
import { formatDuration } from "./utils/formatDuration";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingField, setEditingField] = useState<{ id: number; field: keyof Task; originalValue: string } | null>(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = ({ text, dueDate, duration }: { text: string; dueDate: string; duration: string | null }) => {
    const newTask: Task = {
      id: Date.now(),
      text,
      dueDate,
      duration,
      completed: false,
      dependencies: [],
      subtasks: [],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  };

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId || !task.subtasks) return task;
        return {
          ...task,
          subtasks: task.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ),
        };
      })
    );
  };

  const handleStartEdit = (task: Task, field: keyof Task, value: string) => {
    setEditingField({ id: task.id, field, originalValue: value });
    setEditingValue(value);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    task: Task,
    field: keyof Task
  ) => {
    if (e.key === "Enter") handleBlur(task, field);
    else if (e.key === "Escape") {
      if (editingField) updateTask(task.id, { [field]: editingField.originalValue });
      setEditingField(null);
      setEditingValue("");
    }
  };

  const handleBlur = (task: Task, field: keyof Task) => {
    const trimmedValue = editingValue.trim();
  
    if (trimmedValue === "") {
      updateTask(task.id, { [field]: editingField?.originalValue || task[field] });
    } else if (field === "duration") {
      const formatted = formatDuration(trimmedValue);
  
      if (formatted === null) {
        // ❌ invalid duration, don't update — just revert
        updateTask(task.id, { [field]: editingField?.originalValue || task[field] });
      } else {
        updateTask(task.id, { duration: formatted });
      }
    } else {
      updateTask(task.id, { [field]: trimmedValue });
    }
  
    setEditingField(null);
    setEditingValue("");
  };  

  const getTaskTextById = (id: number) => tasks.find((t) => t.id === id)?.text || `#${id}`;

  return (
    <div className="bg-white text-black min-h-screen w-full flex flex-col md:flex-row">
      <AiSidebar
        onAddTasks={(taskTexts) => {
          const newTasks = taskTexts.map((text) => ({
            id: Date.now() + Math.random(),
            text,
            dueDate: "No date",
            duration: null,
            completed: false,
            dependencies: [],
            subtasks: [],
          }));
          setTasks((prev) => [...newTasks, ...prev]);
        }}
      />

      <main className="w-full md:w-2/3 p-4">
        <h1 className="text-3xl font-bold mb-4">📝 Task List</h1>
        <TaskForm onAddTask={addTask} />
        <TaskList
          tasks={tasks}
          editingField={editingField}
          editingValue={editingValue}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onStartEdit={handleStartEdit}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onChangeEditValue={setEditingValue}
          getTaskTextById={getTaskTextById}
          onToggleSubtask={toggleSubtask}
        />
      </main>
    </div>
  );
}