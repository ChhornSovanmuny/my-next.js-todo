"use client";
import { useState, useEffect } from "react";
import Auth from "./auth";
import { saveTasks, loadTasks } from "./storage";
import { Task } from "./types";

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
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

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
    setShowChat(false); // ログアウト時にチャットを閉じる
  };

  // チャットを閉じる処理
  const handleCloseChat = () => {
    setShowChat(false);
  };

  // Filter tasks based on filter state
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const newMessages = [...chatMessages, { role: "user", content: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/askDify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: chatInput, tasks }),
      });

      const data = await response.json();

      if (data.error) {
        setChatMessages([...newMessages, { 
          role: "assistant", 
          content: `エラーが発生しました: ${data.message || "不明なエラー"}` 
        }]);
        console.error("Chat API Error:", data.details);
      } else if (data.answer) {
        setChatMessages([...newMessages, { role: "assistant", content: data.answer }]);
      } else {
        setChatMessages([...newMessages, { 
          role: "assistant", 
          content: "応答を取得できませんでした。" 
        }]);
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setChatMessages([...newMessages, { 
        role: "assistant", 
        content: "通信エラーが発生しました。後でもう一度お試しください。" 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"} p-4 sm:p-8`} style={{ fontFamily: `'Noto Sans JP', 'Inter', 'Roboto', Arial, sans-serif` }}>
      {/* Dark mode toggle and Chat icon */}
      <div className="absolute top-4 right-6 z-10 flex gap-4">
        {isLoggedIn && (
          <button
            onClick={() => setShowChat(!showChat)}
            className="text-2xl focus:outline-none relative"
            aria-label="Toggle chat"
          >
            💬
            {showChat && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>
        )}
        <button
          onClick={toggleDarkMode}
          className="text-2xl focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>
      </div>

      {/* Chat Interface */}
      {showChat && isLoggedIn && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">AIアシスタント</h3>
            <button
              onClick={handleCloseChat}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                  回答を生成中...
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSend();
                  }
                }}
                placeholder="メッセージを入力..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleChatSend}
                disabled={isChatLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                送信
              </button>
            </div>
          </div>
        </div>
      )}

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
          <form onSubmit={e => { 
            e.preventDefault(); 
            if (!title.trim()) return; 
            setTasks([{ 
              id: Date.now(), 
              title, 
              description,
              completed: false, 
              createdAt: new Date().toISOString(),
              isPriority: false,
              dueDate: dueDate || null
            }, ...tasks]); 
            setTitle(""); 
            setDescription("");
            setDueDate("");
          }} className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded shadow p-4 mb-4 flex flex-col gap-2`}>
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
            <div className="flex gap-2">
              <textarea
                className={`border rounded px-2 py-2 text-sm sm:text-base flex-1 ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800"}`}
                placeholder="タスクの説明を入力..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
              />
              <div className="flex flex-col gap-1">
                <label className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  期限
                </label>
                <input
                  type="datetime-local"
                  className={`border rounded px-2 py-2 text-sm sm:text-base ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800"}`}
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                />
              </div>
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
                  <li key={task.id} className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded shadow p-4 flex flex-col gap-2`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                          }}
                          className="accent-blue-500 w-5 h-5"
                        />
                        <span className={`font-semibold text-sm sm:text-base ${task.completed ? "line-through text-gray-400" : isDarkMode ? "text-white" : "text-gray-800"}`}>
                          {task.title}
                        </span>
                        <button
                          onClick={() => {
                            setTasks(tasks.map(t => t.id === task.id ? { ...t, isPriority: !t.isPriority } : t));
                          }}
                          className={`text-xl ${task.isPriority ? "text-yellow-500" : "text-gray-400"}`}
                        >
                          ★
                        </button>
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
                    </div>
                    {task.description && (
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"} ml-7`}>
                        {task.description}
                      </p>
                    )}
                    {task.dueDate && (
                      <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"} ml-7 flex items-center gap-1`}>
                        <span>📅</span>
                        {new Date(task.dueDate).toLocaleString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
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
