import { Task } from "../types/Task";

interface DependencyListProps {
  dependencies: number[];
  getTaskTextById: (id: number) => string;
}

export default function DependencyList({ dependencies, getTaskTextById }: DependencyListProps) {
  if (dependencies.length === 0) return null;

  return (
    <div className="text-xs text-red-500 mt-1">
      Blocked by: {dependencies.map(getTaskTextById).join(", ")}
    </div>
  );
}
