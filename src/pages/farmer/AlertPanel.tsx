import { useEffect, useState } from "react";
import { fetchUserAlerts, markAlertSeen,  } from "../../api/farmer/alerts";
import { Bell, Map, MapPin, TrendingDown, TrendingUp } from "lucide-react";

type AlertItem = {
  id: number;
  title: string;
  message: string;
  category: string;
  alert_type: string;
  level?: string;
  created_at?: string;
  is_seen?: boolean;
};


const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [unseenCount, setUnseenCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const getLevelColor = (level) => {
  switch (level) {
    case "HIGH":
      return "text-green-600";
    case "LOW":
      return "text-red-600";
    default:
      return "text-orange-500";
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case "PRICE":
      return "text-blue-600";
    case "DEMAND":
      return "text-orange-600";
    default:
      return "text-gray-600";
  }
};

  const loadAlerts = async () => {
    try {
      const res = await fetchUserAlerts();
      setAlerts(res.data.alerts || []);
      setUnseenCount(res.data.unseen_count ?? 0);
      console.log("Fetched alerts:", res.data);
    } catch (err) {
      console.error("Failed to load alerts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleMarkAllSeen = async () => {
    try {
      await markAlertSeen();
      loadAlerts();
    } catch (err) {
      console.error("Failed to mark alerts seen", err);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  if (loading) return <p>Loading alerts...</p>;

  return (
  <div className="p-2">
    {/* LEFT = Alerts (wide), RIGHT = Cards (narrow) */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

      {/* LEFT SIDE (Alerts List) - more width */}
      <div className="lg:col-span-9 bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">🔔 Alerts</h2>

          <button
            onClick={handleMarkAllSeen}
            className="text-sm px-3 py-1 rounded bg-green-600 text-white font-medium hover:bg-green-700"
          >
            Mark all seen
          </button>
        </div>

        {alerts.length === 0 ? (
          <p className="text-gray-500 text-sm">No alerts</p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className="p-3 border-b rounded hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm text-gray-800">
                        {alert.title}
                      </p>

                      <div
                        className={`px-3 rounded-xl ${
                          alert.category === "PRICE"
                            ? "bg-red-800"
                            : alert.category === "DEMAND"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                        }`}
                      >
                        <span className="text-white font-medium text-xs">
                          {alert.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">{alert.message}</p>

                    <div className="flex flex-wrap gap-4 items-center mt-2">
                      <p className="text-sm text-gray-600">
                        <MapPin className="inline mr-1" size={14} />
                        {formatDate(alert.created_at)}
                      </p>

                      <span className="text-gray-500 text-xs">
                        • {alert.alert_type}
                      </span>

                      <span className={`${getLevelColor(alert.level)} text-xs font-medium`}>
                        • {alert.level} {alert.category}
                      </span>
                      <div className="mt-1">
                        {alert.level === "HIGH" && (
                          <div className="bg-green-50 p-1 rounded">
                            <TrendingUp className="text-green-600" size={18} />
                          </div>
                        )}
                        {alert.level === "LOW" && (
                          <div className="bg-red-50 p-1 rounded">
                            <TrendingDown className="text-red-600" size={18} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT SIDE (Cards) - smaller width */}
      <div className="lg:col-span-3 space-y-4">
        {/* Cards row-wise */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">

          {/* Total Alerts Card */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs">Total Alerts</p>
                <h3 className="font-bold text-2xl">{alerts.length}</h3>
                <p className="text-gray-500 text-xs">Total Alerts</p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-green-100/50 p-2">
                <Bell className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Missed Alerts Card */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-xs">Missed Alerts</p>
                <h3 className="font-bold text-2xl">{unseenCount}</h3>
                <p className="text-gray-500 text-xs">Unseen</p>
              </div>

              {/* relative for dot */}
              <div className="relative w-10 h-10 rounded-xl bg-red-100/50 p-2">
                <Bell size={22} className="text-red-700" />
                {unseenCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
);

};

export default AlertsPanel;