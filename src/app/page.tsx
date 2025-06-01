"use client";
import { useState, useEffect } from "react";
import { Task } from "./types";
import { saveTasks, loadTasks } from "./storage";
import TaskCard from "./components/TaskCard";

export default function Home() {
  // タスク状態
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // エラー状態
  const [error, setError] = useState<string | null>(null);

  // タスクの読み込み
  useEffect(() => {
    try {
      const savedTasks = loadTasks();
      setTasks(savedTasks);
    } catch (err) {
      setError('タスクの読み込みに失敗しました。');
    }
  }, []);

  // タスクの保存
  useEffect(() => {
    try {
      saveTasks(tasks);
    } catch (err) {
      setError('タスクの保存に失敗しました。');
    }
  }, [tasks]);

  // ダークモード切り替え
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // タスクの追加
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueDate || null
    };

    setTasks([...tasks, newTask]);
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  // タスクの削除
  const handleDeleteTask = (id: number) => {
    if (window.confirm("このタスクを削除しますか？")) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  // タスクの完了状態の切り替え
  const handleToggleComplete = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // フィルタリングされたタスク
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} p-4 sm:p-8`}>
      {/* ダークモード切り替え */}
      <div className="absolute top-4 right-6">
        <button
          onClick={toggleDarkMode}
          className="text-2xl focus:outline-none transition-transform duration-200 hover:scale-110"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="max-w-xl mx-auto mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Todoアプリ</h1>

        {/* タスク追加フォーム */}
        <form onSubmit={handleAddTask} className="mb-8">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクのタイトル"
              className={`p-2 rounded border ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
              }`}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="タスクの説明（任意）"
              className={`p-2 rounded border ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
              }`}
            />
            <div className="flex items-center gap-2">
              <label className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                期限日:
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`p-2 rounded border ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
                }`}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              タスクを追加
            </button>
          </div>
        </form>

        {/* フィルター */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : isDarkMode
                ? "bg-gray-800"
                : "bg-gray-200"
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded ${
              filter === "active"
                ? "bg-blue-500 text-white"
                : isDarkMode
                ? "bg-gray-800"
                : "bg-gray-200"
            }`}
          >
            未完了
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded ${
              filter === "completed"
                ? "bg-blue-500 text-white"
                : isDarkMode
                ? "bg-gray-800"
                : "bg-gray-200"
            }`}
          >
            完了済み
          </button>
        </div>

        {/* タスク一覧 */}
        <div className="space-y-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
