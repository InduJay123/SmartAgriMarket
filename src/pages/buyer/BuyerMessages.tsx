import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import { getConversations } from "../../api/buyer/messages";
import Chat from "../../components/Chat";
import avatar from "../../assets/avatar.avif";

interface Conversation {
  user_id: number;
  username: string;
  last_message: string;
  timestamp: string;
  profile_image?: string | null;
}

const BuyerMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await getConversations();

        // newest first
        const sorted = [...data].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setConversations(sorted);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return conversations;
    return conversations.filter((c) => c.username.toLowerCase().includes(s));
  }, [q, conversations]);

  const formatDateTime = (timestamp: string) => {
    const dateObj = new Date(timestamp);

    const date = dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { date, time };
  };

  return (
    <div className="p-4">
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-4xl text-black font-bold">💬 Chats</h1>
        <p className="text-md text-gray-500">
          Engage in discussions and share updates with others
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* LEFT: Conversation List */}
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
            <p className="text-sm text-gray-500">No conversations yet.</p>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filtered.map((conv) => {
                const { date, time } = formatDateTime(conv.timestamp);

                return (
                  <button
                    key={conv.user_id}
                    onClick={() => setSelectedUserId(conv.user_id)}
                    className={`w-full text-left border rounded-xl p-3 hover:bg-gray-50 transition ${
                      selectedUserId === conv.user_id ? "border-green-600" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={conv.profile_image || avatar}
                        alt={conv.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium truncate">{conv.username}</p>
                          <div className="text-[11px] text-gray-500 whitespace-nowrap text-right">
                            <p>{date}</p>
                            <p>{time}</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 truncate">
                          {conv.last_message}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT: Chat Window */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-4 h-[75vh] flex flex-col">
          {!selectedUserId ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="w-10 h-10 mb-3 text-gray-300" />
              <p className="font-medium">Select a chat</p>
              <p className="text-sm">Choose a conversation from the left</p>
            </div>
          ) : (
            <div className="flex-1 min-h-0">
              <Chat otherUserId={selectedUserId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerMessages;