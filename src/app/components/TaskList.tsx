import { Task } from "../types/Task";
import TaskItem from "./TaskItem";

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
  onToggleSubtask: (taskId: number, subtaskId: number) => void;
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
  onToggleSubtask,
}: TaskListProps) {
  return (
    <ul className="w-full space-y-2">
      {tasks.map((task) => (
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
          onToggleSubtask={onToggleSubtask}
        />
      ))}
    </ul>
  );
}