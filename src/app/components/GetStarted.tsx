'use client';

import { useRouter } from 'next/navigation';

export default function GetStarted() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          タスク管理アプリへようこそ
        </h1>
        <p className="text-gray-600 mb-8">
          直感的なタスク管理システムで、効率的にタスクを整理し、生産性を向上させましょう。
        </p>
        <button
          onClick={() => router.push('/tasks')}
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
        >
          始める
        </button>
      </div>
    </div>
  );
} 