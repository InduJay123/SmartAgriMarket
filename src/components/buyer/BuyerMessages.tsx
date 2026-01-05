import { useEffect, useState } from "react";
import ChatModal from "./ChatModel";
import { getConversations } from "../../api/buyer/messages";
import avatar from "../../assets/avatar.avif"

interface Conversation {
  user_id: number;
  username: string;
  last_message: string;
  timestamp: string;
  profile_image?:string | null;
}

const BuyerMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeUser, setActiveUser] = useState<number | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
        console.log(data)
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      }
    };
    loadConversations();
  }, []);

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
    <div className="mx-auto mt-6 bg-white shadow rounded-lg">

      <div className="p-2 border bg-gray-100 rounded-xl mb-6">
        <h2 className="text-lg font-semibold p-4">
          Chat
        </h2>
      </div>

      {conversations.map((conv) => (
        <div
          key={conv.user_id}
          onClick={() => setActiveUser(conv.user_id)}
          className="flex  items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-100"
        >
          <div className="flex gap-4">
            <img
              src={conv.profile_image || avatar} 
              alt={conv.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{conv.username}</p>
              <p className="text-sm text-gray-500 truncate">
                {conv.last_message}
              </p>
            </div>
          </div>
          {(() => {
            const { date, time } = formatDateTime(conv.timestamp);
            return (
              <div className="text-right text-xs text-gray-500">
                <p>{date}</p>
                <p>{time}</p>
              </div>
            );
          })()}
        </div>
      ))}

      {activeUser && (
        <ChatModal
          farmerUserId={activeUser}
          onClose={() => setActiveUser(null)}
        />
      )}
    </div>
  );
};

export default BuyerMessages;