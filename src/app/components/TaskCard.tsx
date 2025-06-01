import React from 'react';
import { Task } from '../types';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onTogglePriority: (id: number) => void;
  onDelete: (id: number) => void;
  isDarkMode: boolean;
}

export default function TaskCard({ task, onToggleComplete, onTogglePriority, onDelete, isDarkMode }: TaskCardProps) {
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
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors duration-200 ${
                task.completed
                  ? "bg-blue-500 border-blue-500"
                  : isDarkMode
                  ? "border-gray-600"
                  : "border-gray-300"
              }`}
              aria-label={task.completed ? "タスクを未完了にする" : "タスクを完了にする"}
            >
              {task.completed && (
                <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h3
                className={`text-base font-medium truncate ${
                  task.completed
                    ? "line-through text-gray-400"
                    : isDarkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-sm mt-1 ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } line-clamp-2`}
                >
                  {task.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTogglePriority(task.id)}
              className={`text-xl transition-transform duration-200 hover:scale-110 ${
                task.isPriority ? "text-yellow-500" : "text-gray-400"
              }`}
              aria-label={task.isPriority ? "優先度を解除" : "優先度を設定"}
            >
              ★
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className={`p-1 rounded-full transition-colors duration-200 ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-400 hover:text-red-400"
                  : "hover:bg-gray-100 text-gray-500 hover:text-red-500"
              }`}
              aria-label="タスクを削除"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        {task.dueDate && (
          <div className="mt-2 flex items-center gap-1 text-sm">
            <svg
              className={`w-4 h-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        )}
      </div>
    </motion.li>
  );
} 