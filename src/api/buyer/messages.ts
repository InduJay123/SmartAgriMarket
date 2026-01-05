import api from "../api";

export interface Conversation {
  user_id: number;
  username: string;
  last_message: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  timestamp: string;
  is_read: boolean;
}

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get("/chat/conversations/");
  return response.data;
};

export const getMessages = async (userId: number): Promise<Message[]> => {
  const response = await api.get(`/chat/messages/${userId}/`);
  return response.data;
};

export const sendMessage = async (receiverId: number, content: string): Promise<Message> => {
  const response = await api.post("/chat/send-message/", {
    receiver_id: receiverId,
    content,
  });
  return response.data;
};