import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCommunityMessages,
  sendCommunityMessage,
  type CommunityMessage,
} from "../../api/farmer/communityChat";

const CommunityChat = () => {
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const myUserId = useMemo(() => {
    const v = localStorage.getItem("user_id");
    return Number(v) || 0;
  }, []);

  const load = async () => {
    try {
      const data = await getCommunityMessages();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load community messages", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = async () => {
    if (!text.trim()) return;

    try {
      await sendCommunityMessage(text);
      setText("");
      await load();
    } catch (err) {
      console.error("Failed to send community message", err);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg p-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {messages.map((m) => {
          const senderId = Number(m.sender);
          const isMe = senderId === myUserId;

          return (
            <div
              key={m.id}
              className={`w-full flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {/* show username for others */}
                {!isMe && (
                  <div className="text-[11px] font-semibold text-gray-700 mb-1">
                    {m.sender_username}
                  </div>
                )}

                <div className="whitespace-pre-wrap break-words">{m.content}</div>

                <div className="text-[10px] mt-1 text-right opacity-70">
                  {new Date(m.timestamp).toLocaleTimeString([], {
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
          placeholder="Write something to the farmers community..."
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button
          onClick={onSend}
          className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CommunityChat;