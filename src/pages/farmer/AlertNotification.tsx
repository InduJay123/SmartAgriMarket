import React, { useEffect } from "react";
import axios from "axios";
import api from "../../api/api";

interface Alert {
  id?: number;
  category: string;
  message: string;
}

const AlertNotifications: React.FC = () => {
  useEffect(() => {
    // Ask for notification permission once
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    // Poll backend every 10 seconds
    const interval = setInterval(() => {
      api
        .get<Alert[]>("/alerts/alerts/")
        .then((res) => {
          res.data.forEach((alert) => {
            if (Notification.permission === "granted") {
              new Notification(`${alert.category} Alert`, {
                body: alert.message,
              });
              api.post(`/alerts/alerts/${alert.id}/sent/`);
            }
          });
        })
        .catch((err) => console.error("Alert fetch error:", err));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default AlertNotifications;