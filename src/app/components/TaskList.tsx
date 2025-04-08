"use client";

import { Task } from "../types/Task";
import TaskItem from "./TaskItem";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  editingField: { id: number; field: keyof Task; originalValue: string } | null;
  editingValue: string;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
  onStartEdit: (task: Task, field: keyof Task, value: string) => void;
  onBlur: (task: Task, field: keyof Task) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, task: Task, field: keyof Task) => void;
  onChangeEditValue: (val: string) => void;
  getTaskTextById: (id: number) => string;
  onOpenSidebar: (task: Task) => void;
}

export default function TaskList({
  tasks,
  editingField,
  editingValue,
  onToggleTask,
  onDeleteTask,
  onStartEdit,
  onBlur,
  onKeyDown,
  onChangeEditValue,
  getTaskTextById,
  onOpenSidebar
}: TaskListProps) {
  const [expandedTaskIds, setExpandedTaskIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.dependencies?.includes(b.id)) return 1;
    if (b.dependencies?.includes(a.id)) return -1;
    return 0;
  });

  return (
    <ul className="w-full space-y-2">
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          editingField={editingField}
          editingValue={editingField?.id === task.id ? editingValue : ""}
          onToggle={() => onToggleTask(task.id)}
          onDelete={() => onDeleteTask(task.id)}
          onStartEdit={(field, value) => onStartEdit(task, field, value)}
          onBlur={(field) => onBlur(task, field)}
          onKeyDown={(e, field) => onKeyDown(e, task, field)}
          onChangeEditValue={onChangeEditValue}
          getTaskTextById={getTaskTextById}
          onOpenSidebar={() => onOpenSidebar(task)}
          expanded={expandedTaskIds.includes(task.id)}
          onToggleExpand={() => toggleExpand(task.id)}
        />
      ))}
    </ul>
  );
}