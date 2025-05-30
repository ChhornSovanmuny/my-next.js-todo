// src/app/dify/page.tsx
'use client';

import { useState } from "react";

export default function DifyPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">Dify AI チャット</h1>
        <DifyChat />
      </div>
    </div>
  );
}

function DifyChat() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/askDify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput }),
      });

      const data = await response.json();

      if (data && data.answer) {
        setMessages([...newMessages, { role: "assistant", content: data.answer }]);
      } else {
        setMessages([...newMessages, { role: "assistant", content: "エラーが発生しました。" }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "通信エラーが発生しました。" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-2 max-h-[400px] overflow-y-auto border p-4 rounded">
        {messages.map((msg, index) => (
          <div key={index} className={`text-sm ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${msg.role === "user" ? "bg-blue-100" : "bg-green-100"}`}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div className="text-center text-gray-500">回答を生成中...</div>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          placeholder="質問を入力..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          送信
        </button>
      </div>
    </>
  );
}
