import api from "../api"; 

export type CommunityMessage = {
  id: number;
  sender: number | string;
  sender_username: string;
  content: string;
  timestamp: string;
};

export const getCommunityMessages = async (): Promise<CommunityMessage[]> => {
  const res = await api.get("/chat/community/messages/");
  return res.data;
};

export const sendCommunityMessage = async (content: string) => {
  const res = await api.post("/chat/community/send/", { content });
  return res.data;
};