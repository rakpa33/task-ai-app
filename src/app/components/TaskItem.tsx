import { Task } from "../types/Task";
import SubtaskList from "./SubtaskList";

interface TaskItemProps {
  task: Task;
  editingField: { id: number; field: keyof Task } | null;
  editingValue: string;
  onToggle: () => void;
  onDelete: () => void;
  onStartEdit: (task: Task, field: keyof Task) => void;
  onBlur: (field: keyof Task) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: keyof Task
  ) => void;
  onChangeEditValue: (val: string) => void;
  getTaskTextById: (id: number) => string;
  onToggleSubtask: (taskId: number, subtaskId: number) => void;
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
}: TaskItemProps) {
  const isEditingField = (field: keyof Task) =>
    editingField?.id === task.id && editingField.field === field;

  return (
    <li
      className={`p-4 border rounded ${
        task.completed ? "bg-green-100" : "bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={onToggle}
          className="w-5 h-5"
        />

        <div className="flex flex-col gap-1">
          {/* 🔤 Text Field */}
          <p
            onClick={() => onStartEdit(task, "text")}
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

          {/* ⏱ Duration */}
          <p
            onClick={(e) => {
              e.stopPropagation();
              onStartEdit(task, "duration");
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

          {/* 📅 Due Date */}
          <p
            onClick={(e) => {
              e.stopPropagation();
              onStartEdit(task, "dueDate");
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

          {/* ⛓ Dependencies */}
          {task.dependencies?.length > 0 && (
            <p className="text-xs text-red-500 mt-1">
              Blocked by: {task.dependencies.map(getTaskTextById).join(", ")}
            </p>
          )}

          {/* ✅ Subtasks */}
          {task.subtasks?.length > 0 && (
            <SubtaskList
              taskId={task.id}
              subtasks={task.subtasks}
              onToggle={onToggleSubtask}
            />
          )}
        </div>
      </div>

      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 mt-2"
      >
        ✕ Delete
      </button>
    </li>
  );
}
