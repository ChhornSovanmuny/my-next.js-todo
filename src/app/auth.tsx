"use client";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthProps {
  onLogin: (user: User) => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  currentUser: User | null;
}

export default function Auth({ onLogin, onLogout, isLoggedIn, currentUser }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ここで実際の認証処理を行う
    // 今回はダミーのユーザーを作成
    const user: User = {
      id: Date.now().toString(),
      email,
      name: isRegistering ? name : "ユーザー"
    };
    onLogin(user);
  };

  if (isLoggedIn && currentUser) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm">ようこそ、{currentUser.name}さん</span>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 text-sm"
        >
          ログアウト
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isRegistering ? "新規登録" : "ログイン"}
        </h2>
        {isRegistering && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">名前</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 text-sm"
        >
          {isRegistering ? "登録" : "ログイン"}
        </button>
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-2 text-blue-500 hover:text-blue-600 text-sm"
        >
          {isRegistering ? "ログインに切り替え" : "新規登録に切り替え"}
        </button>
      </form>
    </div>
  );
} 