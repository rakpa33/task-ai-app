"use client";

import { useEffect, useState } from "react";
import { Task } from "./types/Task";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import AiSidebar from "./components/AiSidebar";
import TaskSidebar from "./components/TaskSidebar";
import { formatDuration } from "./utils/formatDuration";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingField, setEditingField] = useState<{ id: number; field: keyof Task; originalValue: string } | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
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
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleSubtask = (taskId: number, subtaskId: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      return {
        ...task,
        subtasks: task.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st),
      };
    }));
  };

  const addSubtask = (taskId: number, text: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const newSubtask = {
        id: Date.now(),
        text,
        completed: false,
      };
      return {
        ...task,
        subtasks: [...(task.subtasks || []), newSubtask],
      };
    }));
  };

  const handleStartEdit = (task: Task, field: keyof Task, value: string) => {
    setEditingField({ id: task.id, field, originalValue: value });
    setEditingValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, task: Task, field: keyof Task) => {
    if (e.key === "Enter") handleBlur(task, field);
    if (e.key === "Escape") {
      updateTask(task.id, { [field]: editingField?.originalValue || task[field] });
      setEditingField(null);
      setEditingValue("");
    }
  };

  const handleBlur = (task: Task, field: keyof Task) => {
    const trimmed = editingValue.trim();
    if (trimmed === "") {
      updateTask(task.id, { [field]: editingField?.originalValue || task[field] });
    } else if (field === "duration") {
      updateTask(task.id, { duration: formatDuration(trimmed) });
    } else {
      updateTask(task.id, { [field]: trimmed });
    }
    setEditingField(null);
    setEditingValue("");
  };

  const getTaskTextById = (id: number) => tasks.find(t => t.id === id)?.text || `#${id}`;

  return (
    <div className="bg-white text-black min-h-screen w-full flex flex-col md:flex-row relative">
      <AiSidebar
        onAddTasks={(taskTexts) => {
          const newTasks = taskTexts.map(text => ({
            id: Date.now() + Math.random(),
            text,
            dueDate: "No date",
            duration: null,
            completed: false,
            dependencies: [],
            subtasks: [],
          }));
          setTasks(prev => [...newTasks, ...prev]);
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
          onOpenSidebar={(task) => setSelectedTask(task)}
        />
      </main>

      {selectedTask && (
        <TaskSidebar
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={updateTask}
      />      
      )}
    </div>
  );
}
