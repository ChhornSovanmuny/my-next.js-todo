import { NextRequest, NextResponse } from 'next/server';
import { Task } from '@/app/types';

// DifyのAPIエンドポイントとAPIキー（環境変数を利用）
const DIFY_API_URL = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';
const DIFY_API_KEY = process.env.DIFY_API_KEY;
const DIFY_TIMEOUT = 30000; // 30秒のタイムアウト

// タイムアウト付きのfetch関数
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('リクエストがタイムアウトしました');
    }
    throw error;
  }
}

// Difyとの通信を行う関数
async function communicateWithDify(message: string, tasks: Task[]) {
  if (!DIFY_API_KEY) {
    throw new Error('Dify APIキーが設定されていません');
  }

  try {
    const response = await fetchWithTimeout(
      `${DIFY_API_URL}/chat-messages`,
      {
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
      },
      DIFY_TIMEOUT
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Dify API error: ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      answer: data.answer || '応答を生成できませんでした。',
      metadata: {
        model: data.model,
        usage: data.usage,
        timestamp: new Date().toISOString()
      }
    };
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
    
    // エラーメッセージの整形
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    const statusCode = errorMessage.includes('タイムアウト') ? 504 : 500;

    return NextResponse.json(
      { 
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
} 