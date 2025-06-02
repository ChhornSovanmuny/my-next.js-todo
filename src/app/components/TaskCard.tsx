'use client';

import { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  isDarkMode: boolean;
}

export default function TaskCard({ task, onToggle, onDelete, isDarkMode }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`p-4 rounded-lg shadow ${
        isDarkMode
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
        />
        <div className="flex-1">
          <h3
            className={`text-lg font-medium ${
              task.completed
                ? "line-through text-gray-500"
                : isDarkMode
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`mt-1 ${
                task.completed
                  ? "text-gray-400"
                  : isDarkMode
                  ? "text-gray-300"
                  : "text-gray-600"
              }`}
            >
              {task.description}
            </p>
          )}
          <div className="mt-2 space-y-1">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              作成日: {formatDate(task.createdAt)}
            </p>
            {task.dueDate && (
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                期限日: {formatDate(task.dueDate)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 focus:outline-none"
          aria-label="タスクを削除"
        >
          ×
        </button>
      </div>
    </div>
  );
} 