export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    isPriority: boolean;
    dueDate: string | null;
}