"use client";

import { Task } from "../types/Task";
import DependencyList from "./DependencyList";

interface TaskItemProps {
  task: Task;
  editingField: { id: number; field: keyof Task } | null;
  editingValue: string;
  onToggle: () => void;
  onDelete: () => void;
  onStartEdit: (field: keyof Task, value: string) => void;
  onBlur: (field: keyof Task) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, field: keyof Task) => void;
  onChangeEditValue: (val: string) => void;
  getTaskTextById: (id: number) => string;
  onOpenSidebar: () => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

export default function TaskItem({
  task,
  editingField,
  editingValue,
  onToggle,
  onDelete,
  onStartEdit,
  onBlur,
  onKeyDown,
  onChangeEditValue,
  getTaskTextById,
  onOpenSidebar,
  expanded,
  onToggleExpand,
}: TaskItemProps) {
  const isEditingField = (field: keyof Task) =>
    editingField?.id === task.id && editingField.field === field;

  return (
    <li className={`p-4 border rounded ${task.completed ? "bg-green-100" : "bg-white"}`}>
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggle}
            className="w-5 h-5"
          />
          <div className="flex flex-col gap-1">
            <p
              onClick={() => onStartEdit("text", task.text)}
              className="cursor-pointer font-medium"
            >
              {isEditingField("text") ? (
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => onChangeEditValue(e.target.value)}
                  onBlur={() => onBlur("text")}
                  onKeyDown={(e) => onKeyDown(e, "text")}
                  autoFocus
                  className="p-1 border rounded text-black"
                />
              ) : (
                task.text
              )}
            </p>
            <p
              onClick={() => onStartEdit("duration", task.duration || "")}
              className="cursor-pointer text-sm text-gray-500"
            >
              {isEditingField("duration") ? (
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => onChangeEditValue(e.target.value)}
                  onBlur={() => onBlur("duration")}
                  onKeyDown={(e) => onKeyDown(e, "duration")}
                  autoFocus
                  className="p-1 border rounded text-black"
                />
              ) : (
                `Duration: ${task.duration ?? "--"}`
              )}
            </p>
            <p
              onClick={() => onStartEdit("dueDate", task.dueDate)}
              className="cursor-pointer text-sm text-gray-500"
            >
              {isEditingField("dueDate") ? (
                <input
                  type="date"
                  value={editingValue}
                  onChange={(e) => onChangeEditValue(e.target.value)}
                  onBlur={() => onBlur("dueDate")}
                  onKeyDown={(e) => onKeyDown(e, "dueDate")}
                  autoFocus
                  className="p-1 border rounded text-black"
                />
              ) : (
                `Due: ${task.dueDate}`
              )}
            </p>

            {task.dependencies?.length > 0 && (
              <DependencyList
                dependencies={task.dependencies}
                getTaskTextById={getTaskTextById}
              />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onToggleExpand} className="text-blue-500 hover:underline">
            {expanded ? "Collapse" : "Details"}
          </button>
          <button onClick={onDelete} className="text-red-500 hover:text-red-700">
            ✕
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-2">
          <button
            onClick={onOpenSidebar}
            className="bg-gray-200 px-2 py-1 text-sm rounded hover:bg-gray-300"
          >
            Open Sidebar
          </button>
        </div>
      )}
    </li>
  );
}