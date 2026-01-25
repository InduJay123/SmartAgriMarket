import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import Chat from "../../components/Chat";
import { getChatList } from "../../api/farmer/chat";

type ChatItem = {
  user_id: number;
  username: string;
  last_message: string;
  timestamp: string;
  profile_image?: string | null;
};

const FarmerMessages = () => {
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [q, setQ] = useState("");

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await getChatList();

      // newest first
      const sorted = [...data].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setChatList(sorted);
    } catch (err) {
      console.error("Failed to load chats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return chatList;
    return chatList.filter((c) => c.username.toLowerCase().includes(s));
  }, [q, chatList]);

  return (
    <div className="p-4">
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-4xl text-black font-bold flex items-center gap-2">
          <span>💬</span> Chats
        </h1>
        <p className="text-md text-gray-500">
          Engage in discussions and share updates with others
        </p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LEFT: Chat list */}
        <div className="md:col-span-1 bg-white rounded-xl shadow p-4 h-[75vh] flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="text-yellow-500" />
            <h2 className="font-semibold text-lg">Messages</h2>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 border rounded-lg px-3 py-2 mb-3">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search users..."
              className="w-full outline-none text-sm"
            />
          </div>

          {/* List */}
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-500">No chats yet.</p>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filtered.map((c) => (
                <button
                  key={c.user_id}
                  onClick={() => setSelectedUserId(c.user_id)}
                  className={`w-full text-left border rounded-xl p-3 hover:bg-gray-50 transition ${
                    selectedUserId === c.user_id ? "border-green-600" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                      {c.profile_image ? (
                        <img
                          src={c.profile_image}
                          alt={c.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-600">
                          {c.username?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate">{c.username}</p>
                        <p className="text-[11px] text-gray-500 whitespace-nowrap">
                          {new Date(c.timestamp).toLocaleString()}
                        </p>
                      </div>

                      <p className="text-sm text-gray-600 truncate">
                        {c.last_message}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Chat window */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-4 h-[75vh] flex flex-col">
          {!selectedUserId ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="w-10 h-10 mb-3 text-gray-300" />
              <p className="font-medium">Select a chat</p>
              <p className="text-sm">Choose a conversation from the left to start messaging</p>
            </div>
          ) : (
            <div className="flex-1 min-h-0">
              {/* IMPORTANT: Your Chat component should be h-full */}
              <Chat otherUserId={selectedUserId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerMessages;