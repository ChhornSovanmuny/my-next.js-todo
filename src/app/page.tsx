"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Auth from "./auth";
import { saveTasks, loadTasks, syncTasks } from "./storage";

// タスク型の定義
interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

export default function Home() {
  // ユーザー状態
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // タスク状態
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "dueDate" | "priority">("createdAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // タスクの読み込み
  useEffect(() => {
    if (isLoggedIn) {
      const savedTasks = loadTasks();
      setTasks(savedTasks);
    }
  }, [isLoggedIn]);

  // タスクの保存
  useEffect(() => {
    if (isLoggedIn && tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks, isLoggedIn]);

  // タスクの同期
  const handleSync = async () => {
    if (isLoggedIn) {
      const syncedTasks = await syncTasks(tasks);
      setTasks(syncedTasks);
    }
  };

  // ダークモード切り替え
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // ログイン処理
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    // ここでユーザーごとのタスクを読み込む
    // 今回はダミーのタスクを作成
    setTasks([]);
  };

  // ログアウト処理
  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setTasks([]);
  };

  // Filter tasks based on filter state
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} p-4 sm:p-8`} style={{ fontFamily: `'Noto Sans JP', 'Inter', 'Roboto', Arial, sans-serif` }}>
      {/* Dark mode toggle at top right */}
      <div className="absolute top-4 right-6 z-10">
        <button
          onClick={toggleDarkMode}
          className="text-2xl focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>
      </div>

      {/* Gradient Header Card */}
      <div
        className="flex flex-col items-center justify-center min-h-[180px] max-w-xl mx-auto mb-8 rounded-xl shadow-lg"
        style={{
          background: "linear-gradient(90deg, #4f8cff 0%, #a259ff 100%)",
          color: "#fff",
          padding: "2.5rem 1rem 2rem 1rem"
        }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ letterSpacing: "0.05em" }}>
          TODOアプリ
        </h1>
        <p className="text-base sm:text-lg font-medium opacity-90">
          タスクを管理して生産性を向上させましょう
        </p>
      </div>

      {/* Centered login area if not logged in */}
      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center gap-6">
            <Auth
              onLogin={handleLogin}
              onLogout={handleLogout}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
            />
            <div className="text-gray-500 text-center">タスクを管理するにはログインしてください。</div>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-6">
          {/* Simple add task form (no tag, date, category) */}
          <form onSubmit={e => { e.preventDefault(); if (!title.trim()) return; setTasks([{ id: Date.now(), title, completed: false, createdAt: new Date().toISOString() }, ...tasks]); setTitle(""); }} className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded shadow p-4 mb-4 flex flex-col gap-2`}>
            <div className="flex gap-2">
              <input
                className={`border rounded px-2 py-2 text-sm sm:text-base flex-1 ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800"}`}
                placeholder="新しいタスクを入力..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                style={{ fontWeight: 500 }}
              />
              <button type="submit" className="bg-blue-500 text-white font-bold rounded px-6 py-2 hover:bg-blue-600 text-sm sm:text-base">
                ＋追加
              </button>
            </div>
          </form>

          {/* Filter buttons */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              className={`px-4 py-1 rounded text-sm font-bold ${filter === 'all' ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('all')}
            >
              すべて
            </button>
            <button
              className={`px-4 py-1 rounded text-sm font-bold ${filter === 'active' ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('active')}
            >
              未完了
            </button>
            <button
              className={`px-4 py-1 rounded text-sm font-bold ${filter === 'completed' ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('completed')}
            >
              完了済み
            </button>
          </div>

          {/* Task list (no tag, date, category, or filters) */}
          <div className="max-w-xl mx-auto">
            {filteredTasks.length === 0 ? (
              <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"} text-sm sm:text-base`}>タスクがありません</p>
            ) : (
              <ul className="space-y-2">
                {filteredTasks.map(task => (
                  <li key={task.id} className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded shadow p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {
                          setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                        }}
                        className="accent-blue-500 w-5 h-5"
                      />
                      <span className={`font-semibold text-sm sm:text-base ${task.completed ? "line-through text-gray-400" : isDarkMode ? "text-white" : "text-gray-800"}`}>{task.title}</span>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm("このタスクを削除しますか？")) {
                          setTasks(tasks.filter(t => t.id !== task.id));
                        }
                      }}
                      className="text-red-500 hover:text-red-700 text-sm sm:text-base"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
