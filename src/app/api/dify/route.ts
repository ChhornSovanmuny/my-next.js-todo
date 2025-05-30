import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/app/types';

// DifyのAPIエンドポイントとAPIキー（環境変数を利用）
const DIFY_API_URL = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';
const DIFY_API_KEY = process.env.DIFY_API_KEY;

// Difyとの通信を行う関数
async function communicateWithDify(message: string, tasks: Task[]) {
  if (!DIFY_API_KEY) {
    throw new Error('Dify APIキーが設定されていません');
  }
  try {
    const response = await fetch(`${DIFY_API_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIFY_API_KEY}`
      },
      body: JSON.stringify({
        inputs: {
          tasks: JSON.stringify(tasks)
        },
        query: message,
        response_mode: 'blocking',
        user: 'user'
      })
    });

    if (!response.ok) {
      throw new Error(`Dify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Dify API error:', error);
    throw error;
  }
}

// POST: Difyとのチャット
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, tasks } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'メッセージが必要です' },
        { status: 400 }
      );
    }

    const data = await communicateWithDify(message, tasks);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Dify route:', error);
    return NextResponse.json(
      { error: 'Difyとの通信に失敗しました' },
      { status: 500 }
    );
  }
} 