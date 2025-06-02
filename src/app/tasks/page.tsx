'use client';

import { useState } from 'react';
import { Task } from '../types';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} py-8`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            タスク管理
          </h1>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-2xl focus:outline-none transition-transform duration-200 hover:scale-110"
            aria-label="ダークモード切り替え"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>

        <TaskForm onAddTask={addTask} isDarkMode={isDarkMode} />

        {/* フィルター */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded ${
              filter === 'active'
                ? 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            未完了
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded ${
              filter === 'completed'
                ? 'bg-blue-500 text-white'
                : isDarkMode
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            完了済み
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 