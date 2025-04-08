interface DependencyListProps {
    dependencyIds: number[];
    getTaskTextById: (id: number) => string;
  }
  
  export default function DependencyList({
    dependencyIds,
    getTaskTextById,
  }: DependencyListProps) {
    return (
      <div className="mt-2 ml-4 text-sm text-gray-600">
        <p className="font-medium text-red-600">Depends on:</p>
        <ul className="list-disc list-inside ml-2">
          {dependencyIds.map((id) => (
            <li key={id}>{getTaskTextById(id)}</li>
          ))}
        </ul>
      </div>
    );
  }
  