"use client"
import { useState, useEffect, useRef } from "react"
import { KokoroTTS } from "kokoro-js";
import { sendMessage } from "@/lib/api"

type Message = {
  sender: "user" | "robot";
  text: string;
  audioUrl?: string; // Only for robot messages
};

export default function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const ttsRef = useRef<KokoroTTS | null>(null);

  // Load Kokoro model once
  useEffect(() => {
    async function loadTTS() {
      try {
        const model = await KokoroTTS.from_pretrained(
          "onnx-community/Kokoro-82M-ONNX",
          { dtype: "q8" }
        );
        ttsRef.current = model;
      } catch (err) {
        console.error("Failed to load Kokoro TTS:", err);
      }
    }
    loadTTS();
  }, []);

  // Handle message sending
  async function handleSend() {
    if (input.trim() === "") return;

    const userText = input.trim();
    setInput("");
    setLoading(true);

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    try {
      // Replace this with your backend call
      const res = await sendMessage(userText);
      const botText = res.reply;

      console.log(botText)

      let audioUrl: string | undefined;

      if (ttsRef.current) {
        const audio = await ttsRef.current.generate(botText, { voice: "af_heart" });
        const wavBuffer = audio.toWav();
        const blob = new Blob([wavBuffer], { type: "audio/wav" });
        audioUrl = URL.createObjectURL(blob);
      }

      // Add bot message
      setMessages((prev) => [...prev, { sender: "robot", text: botText, audioUrl }]);
    } catch (err) {
      console.error("Error during message handling:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handlePlayAudio(url: string) {
    const audio = new Audio(url);
    audio.play().catch((err) => {
      console.warn("Audio playback failed:", err);
    });
  }

  return (
    <div className="flex flex-col justify-between h-screen max-w-3xl mx-auto p-4 bg-blue-950 text-white">
      <h1 className="text-2xl font-bold mb-4">ChatBot</h1>

      <div className="flex-grow overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl max-w-xl ${
              msg.sender === "user" ? "bg-green-700 self-end" : "bg-gray-700 self-start"
            }`}
          >
            <div>{msg.text}</div>
            {msg.sender === "robot" && msg.audioUrl && (
              <button
                onClick={() => handlePlayAudio(msg.audioUrl!)}
                className="mt-2 px-3 py-1 text-sm bg-green-600 rounded"
              >
                🔊 Play
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleEnterKey}
          className="flex-1 p-2 rounded-xl border border-white text-black"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-red-500 px-4 py-2 rounded-xl border border-white"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
