import { useState } from "react";
import { Task } from "../types/Task";
import SubtaskList from "./SubtaskList";
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
  onToggleSubtask: (taskId: number, subtaskId: number) => void;
  onAddSubtask: (taskId: number, subtaskText: string) => void;
  expanded: boolean;
  onToggleExpand: () => void;
  onOpenSidebar: (task: Task) => void;
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
  onToggleSubtask,
  onAddSubtask,
  expanded,
  onToggleExpand,
  onOpenSidebar,
}: TaskItemProps) {
  const isEditingField = (field: keyof Task) =>
    editingField?.id === task.id && editingField.field === field;

  const [newSubtask, setNewSubtask] = useState("");

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(task.id, newSubtask.trim());
      setNewSubtask("");
    }
  };

  return (
    <li
      className={`p-4 border rounded ${task.completed ? "bg-green-100" : "bg-white"}`}
      onClick={() => onOpenSidebar(task)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 w-full">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={onToggle}
            className="w-5 h-5 mt-1"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center justify-between">
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  onStartEdit("text", task.text);
                }}
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

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand();
                }}
                className="text-sm text-blue-500 hover:underline"
              >
                {expanded ? "▾ Collapse" : "▸ Expand"}
              </button>
            </div>

            <p
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit("duration", task.duration || "");
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit("dueDate", task.dueDate);
              }}
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

            {expanded && (
              <>
                {task.dependencies?.length > 0 && (
                  <DependencyList
                    dependencyIds={task.dependencies}
                    getTaskTextById={getTaskTextById}
                  />
                )}

                {task.subtasks && (
                  <>
                    <SubtaskList
                      taskId={task.id}
                      subtasks={task.subtasks}
                      onToggle={onToggleSubtask}
                    />
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        className="flex-1 p-1 border rounded text-black"
                        placeholder="New subtask"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSubtask();
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Add
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-red-500 hover:text-red-700 mt-1"
        >
          ✕ Delete
        </button>
      </div>
    </li>
  );
}
