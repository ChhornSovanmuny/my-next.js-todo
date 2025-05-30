import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/app/types';

// メモリ内のタスクストレージ（実際のアプリケーションではデータベースを使用することを推奨）
let tasks: Task[] = [
  {
    id: 1,
    title: '牛乳を買う',
    description: 'スーパーで牛乳を2本買う',
    completed: false,
    createdAt: new Date().toISOString(),
    isPriority: true,
    dueDate: '2025-05-30T15:00:00'
  },
  {
    id: 2,
    title: 'レポートを提出',
    description: '期末レポートを提出期限までに完成させる',
    completed: false,
    createdAt: new Date().toISOString(),
    isPriority: false,
    dueDate: '2025-06-01T17:00:00'
  }
];

// サンプルのタスクデータ
const sampleTasks = [
  {
    id: '1',
    title: 'サンプルタスク1',
    description: 'これはサンプルのタスクです',
    isPriority: false,
    dueDate: null
  },
  {
    id: '2',
    title: 'サンプルタスク2',
    description: '締切が近いタスク',
    isPriority: true,
    dueDate: '2024-06-30T23:59:59Z'
  }
];

// GET: タスクの取得
export async function GET() {
  return NextResponse.json(sampleTasks);
}

// POST: 新しいタスクの作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTask: Task = {
      id: Date.now(),
      title: body.title,
      description: body.description || '',
      completed: false,
      createdAt: new Date().toISOString(),
      isPriority: body.isPriority || false,
      dueDate: body.dueDate || null
    };
    tasks.push(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'タスクの作成に失敗しました' },
      { status: 500 }
    );
  }
}

// PUT: タスクの更新
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const taskId = body.id;
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'タスクが見つかりません' },
        { status: 404 }
      );
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...body,
      id: taskId // IDは変更不可
    };

    return NextResponse.json(tasks[taskIndex]);
  } catch {
    return NextResponse.json(
      { error: 'タスクの更新に失敗しました' },
      { status: 500 }
    );
  }
}

// DELETE: タスクの削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = Number(searchParams.get('id'));

    if (!taskId) {
      return NextResponse.json(
        { error: 'タスクIDが必要です' },
        { status: 400 }
      );
    }

    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'タスクが見つかりません' },
        { status: 404 }
      );
    }

    tasks = tasks.filter(task => task.id !== taskId);
    return NextResponse.json({ message: 'タスクを削除しました' });
  } catch {
    return NextResponse.json(
      { error: 'タスクの削除に失敗しました' },
      { status: 500 }
    );
  }
}
