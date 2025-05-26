import { Task } from "./types";

// ローカルストレージのキー
const TASKS_KEY = "tasks";

// タスクの保存
export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

// タスクの読み込み
export const loadTasks = (): Task[] => {
  const tasksJson = localStorage.getItem(TASKS_KEY);
  return tasksJson ? JSON.parse(tasksJson) : [];
};

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