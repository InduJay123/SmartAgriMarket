import { useEffect, useState } from "react";
import api from "../api/api";
import { getMessages } from "../api/buyer/messages";
interface Message {
  id: number;
  sender: number;
  receiver: number;
  content: string;
  timestamp: string;
}

const Chat = ({ otherUserId }: { otherUserId: number }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  const userId = Number(localStorage.getItem("user_id"));

  // Load messages
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

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    await api.post("/chat/send-message/", {
      receiver_id: otherUserId,
      content: text,
    });

    setText("");
    loadMessages();
  };

  return (
    <div className="flex flex-col h-[500px] border rounded p-4">
      <div className="flex-1 overflow-y-auto mb-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 max-w-[70%] p-2 rounded ${
              msg.sender === userId
                ? "ml-auto bg-green-600 text-white"
                : "mr-auto bg-gray-200"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-green-700 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;