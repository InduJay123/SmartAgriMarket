import api from "../api";

export const fetchUserAlerts = () => {
  return api.get("/alerts/alerts/");
};

export const markAlertSeen = () => {
  return api.post(`/alerts/mark-seen/`);
};