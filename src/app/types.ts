export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    dueDate: string | null;
    isPriority: boolean;
}