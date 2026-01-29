import React, { useEffect } from "react";
import api from "../../api/api";

interface UserAlert {
  id?: number;
  alert_id: number;
  category: string;
  message: string;
}

const AlertNotifications: React.FC = () => {
  useEffect(() => {
    // Ask for notification permission once
    if ("Notification" in window) {
      Notification.requestPermission();
    }
    const shownAlerts = new Set<number>();
    const interval = setInterval(() => {
      api
        .get<UserAlert[]>("/user-alerts/")
        .then((res) => {
          res.data.forEach((alert) => {
            if (Notification.permission === "granted" && !shownAlerts.has(alert.id)) {
              new Notification(`${alert.category} Alert`, {
                body: alert.message,
              });
              api.post(`/user-alerts/${alert.id}/sent/`);
              shownAlerts.add(alert.id);
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