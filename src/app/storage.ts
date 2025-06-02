import { Task } from "./types";

const STORAGE_KEY = "todo-tasks";

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Failed to save tasks:", error);
    throw new Error("タスクの保存に失敗しました");
  }
}

export function loadTasks(): Task[] {
  try {
    const tasks = localStorage.getItem(STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Failed to load tasks:", error);
    throw new Error("タスクの読み込みに失敗しました");
  }
}

// タスクの同期（複数デバイス間）
export const syncTasks = async (tasks: Task[]): Promise<Task[]> => {
  try {
    // ここで実際のクラウドストレージとの同期処理を行う
    // 今回はローカルストレージのみを使用
    saveTasks(tasks);
    return tasks;
  } catch (error) {
    console.error("タスクの同期に失敗しました:", error);
    return tasks;
  }
}; 