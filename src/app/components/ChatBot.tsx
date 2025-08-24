"use client"
import { useState, useEffect } from "react"
import { KokoroTTS } from "kokoro-js";

import ChatBotMessages from "./ChatBotMessages"
import { sendMessage } from "@/lib/api"

type message = { sender: "user" | "robot", message: string }


export default function ChatBot() {
    const [audioReady, setAudioReady] = useState(false);
    const [playUrl, setPlayUrl] = useState<string | null>(null);

    useEffect(() => {
        async function runTTS() {
            try {
                const tts = await KokoroTTS.from_pretrained(
                    "onnx-community/Kokoro-82M-ONNX",
                    { dtype: "q8" }
                );

                const text = "Greetings, My name is Alice, i'm from Addis Ababa, Ethiopia!";
                const audio = await tts.generate(text, { voice: "af_heart" });

                const wavBuffer = audio.toWav();
                if (!wavBuffer || wavBuffer.byteLength === 0) {
                    console.warn("WAV audio is empty!");
                    return;
                }

                // Play audio in-browser
                const blob = new Blob([wavBuffer], { type: "audio/wav" });
                const url = URL.createObjectURL(blob);

                setPlayUrl(url); // store for manual playback
                setAudioReady(true); // allow user interaction

            } catch (err) {
                console.error("TTS Error:", err);
            }
        }

        runTTS();
    }, []);

    const handlePlay = () => {
        if (!playUrl) return;

        const audioElement = new Audio(playUrl);

        audioElement.onended = () => console.log("Playback finished.");
        audioElement.onerror = (e) => console.error("Playback error:", e);

        audioElement.play().catch((err) => {
            console.warn("Playback blocked by browser:", err);
        });
    };


    // const stream = tts.stream(text);
    // let i = 0;
    // for await (const { text: chunkText, phonemes, audio } of stream) {
    //   audio.save(`chunk-${i++}.wav`);
    // }

    let [input, setInput] = useState("")
    let [messages, setMessages] = useState<message[]>([])


    async function handleSend() {
        // checks if message input is empty, returns if true
        if (input.trim() === "") return

        // updates chat messages
        setMessages((prev) => ([...prev, { sender: "user", message: input }]))

        // resets message input
        setInput("")

        // sends message to the backend
        const res = await sendMessage(input)

        setMessages((prev) => [...prev, { sender: "robot", message: res.reply }])
    }

    function handleEnterButton(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend()
        }
    }

    return (
        <>
            <div className="flex flex-col justify-between h-screen max-w-3xl mx-auto p-4 bg-blue-950">
                <div className="chat-messages-div">
                    <h1 className="text-center text-3xl font-bold">Messages</h1>
                    <ChatBotMessages messages={messages} />
                </div>

                <div className="input-box-div mb-1 flex flex-col md:flex-row gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleEnterButton}
                        className="p-2 border-white border-2 rounded-2xl flex-1"
                        placeholder="Write your message here..."
                    />
                    <button onClick={handleSend} className="bg-red-500 py-2 px-4 border-white border-2 rounded-2xl ml-1">Send</button>
                </div>

            </div>

            <div className="p-4 text-white">
                <h1 className="text-2xl font-bold">ChatBot</h1>
                {audioReady ? (
                    <button onClick={handlePlay} className="mt-4 px-4 py-2 bg-green-600 rounded">
                        🔊 Play Kokoro TTS
                    </button>
                ) : (
                    <p className="text-gray-400">Generating speech...</p>
                )}
            </div>
        </>
    )
}