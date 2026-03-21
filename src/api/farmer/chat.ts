import api from "../api"; // adjust if your api instance path differs

export type ConversationItem = {
  user_id: number;
  username: string;
  last_message: string;
  timestamp: string;
  profile_image?: string | null;
};

export const getConversations = async (): Promise<ConversationItem[]> => {
  const res = await api.get("/chat/conversations/");
  return res.data;
};

export const getChatList = async () => {
  const res = await api.get("/chat/conversations/");
  return res.data;
};
