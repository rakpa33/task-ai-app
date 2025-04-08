import { Subtask } from "../types/Task";

interface SubtaskListProps {
  taskId: number;
  subtasks: Subtask[];
  onToggle: (taskId: number, subtaskId: number) => void;
}

export default function SubtaskList({ taskId, subtasks, onToggle }: SubtaskListProps) {
  return (
    <ul className="ml-4 mt-2 space-y-1">
      {subtasks.map((subtask) => (
        <li key={subtask.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={subtask.completed}
            onChange={() => onToggle(taskId, subtask.id)}
          />
          <span className={`${subtask.completed ? 'line-through text-gray-400' : ''}`}>{subtask.text}</span>
        </li>
      ))}
    </ul>
  );
}