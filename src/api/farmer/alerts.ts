import api from "../api";

export const fetchUserAlerts = (limit: number = 100) => {
  return api.get(`/alerts/alerts/?limit=${limit}`);
};

export const markAlertSeen = () => {
  return api.post(`/alerts/mark-seen/`);
};