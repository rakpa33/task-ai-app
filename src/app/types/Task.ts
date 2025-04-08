export type Subtask = {
    id: number;
    text: string;
    completed: boolean;
  };
  
  export type Task = {
    id: number;
    text: string;
    dueDate: string;
    duration: string | null;
    completed: boolean;
    dependencies: number[]; // ✅ Add this line
    subtasks: Subtask[];     // ✅ And this one if not already present
  };
  