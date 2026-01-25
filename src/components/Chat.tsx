import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/api";
import { getMessages } from "../api/buyer/messages";

type UserLike = number | string | { id?: number | string } | null | undefined;

interface Message {
  id: number;
  sender: UserLike;
  receiver: UserLike;
  content: string;
  timestamp: string;
}

function getId(value: UserLike): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  if (typeof value === "object" && "id" in value) return Number(value.id) || 0;
  return 0;
}

const Chat = ({ otherUserId }: { otherUserId: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const myUserId = useMemo(() => {
    const v = localStorage.getItem("user_id");
    return Number(v) || 0;
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getMessages(otherUserId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [otherUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await api.post("/chat/send-message/", {
        receiver_id: otherUserId,
        content: text,
      });

      setText("");
      await loadMessages();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  
  return (
    <div className="flex flex-col h-full border rounded-lg p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((msg) => {
  const senderId = getId(msg.sender);
  const isSender = senderId === myUserId;

  // ✅ DEBUG LOG (SAFE)
  console.log(
    "myUserId:", myUserId,
    "| sender:", msg.sender,
    "| senderId:", senderId
  );

  return (
    <div
      key={msg.id}
      className={`w-full flex ${isSender ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
          isSender
            ? "bg-green-600 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">
          {msg.content}
        </div>

        <div className="text-[10px] mt-1 text-right opacity-70">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
})}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
