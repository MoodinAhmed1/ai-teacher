import { useEffect, useRef } from "react"
import ChatBotMessage from "./ChatBotMessage"

type Message = { sender: "user" | "robot", message: string }

export default function ChatBotMessages(
  { messages }: { messages: Message[] }
) {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="chat-messages flex flex-col space-y-2 overflow-y-auto">
      {messages.map((msg: Message, i: number) => (
        <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
          <ChatBotMessage msg={msg} />
        </div>
      ))}
      
      {/* Invisible div to scroll into view */}
      <div ref={endOfMessagesRef} />
    </div>
  )
}
