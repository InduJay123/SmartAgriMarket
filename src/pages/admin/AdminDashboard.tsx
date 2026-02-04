import {
  Users,
  AlertTriangle,
  ShoppingCart,
  Leaf,
  CheckCircle,
  Eye,
  XCircle,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import * as Dialog from "@radix-ui/react-dialog";
import TopCard from "../../components/admin/TopCard";
import ActivityTable from "../../components/admin/ActivityTable";
import { useEffect, useState } from "react";
import api from "../../services/api";

interface PendingUser {
  id: number;
  email: string;
  role: string;
  is_verified: boolean;
}

const AdminDashboard: React.FC = () => {
  /* -------------------- STATES -------------------- */
  const [farmers, setFarmers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);

  /* -------------------- STATIC DATA -------------------- */
  const priceData = [
    { month: "Jan", price: 110 },
    { month: "Feb", price: 90 },
    { month: "Mar", price: 70 },
    { month: "Apr", price: 150 },
    { month: "May", price: 100 },
    { month: "Jun", price: 80 },
  ];

  const supplyData = [
    { crop: "Carrots", supply: 65 },
    { crop: "Tomato", supply: 52 },
    { crop: "Onion", supply: 45 },
    { crop: "Potato", supply: 38 },
    { crop: "Chilli", supply: 18 },
  ];

  const activities = [
    { date: "2025-11-09", activity: "Uploaded new crop price data", user: "Admin" },
    { date: "2025-11-08", activity: "Verified farmer account", user: "Admin" },
  ];

  /* -------------------- API CALLS -------------------- */
  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/auth/admin/dashboard-stats/");
      setFarmers(res.data.verified_farmers);
      setPendingApprovals(res.data.pending_approvals);
    } catch (err) {
      console.error("Dashboard stats error", err);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get("/auth/admin/farmers/");
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Pending users error", err);
    } finally {
      setLoadingPending(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.patch(`/auth/admin/farmers/${id}/approve/`);
      fetchPendingUsers();
      fetchDashboardStats();
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.patch(`/auth/admin/farmers/${id}/reject/`);
      fetchPendingUsers();
      fetchDashboardStats();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  /* -------------------- EFFECTS -------------------- */
  useEffect(() => {
    fetchDashboardStats();
    fetchPendingUsers();
  }, []);

  /* -------------------- UI -------------------- */
  const stats = [
    {
      title: "Verified Farmers",
      value: farmers.toString(),
      icon: Users,
      color: "text-green-300",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals.toString(),
      icon: AlertTriangle,
      color: "text-red-300",
      bgColor: "bg-red-50",
    },
    {
      title: "Buyers",
      value: "—",
      icon: ShoppingCart,
      color: "text-blue-300",
      bgColor: "bg-blue-50",
    },
    {
      title: "Crops",
      value: "—",
      icon: Leaf,
      color: "text-amber-900",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="space-y-6 pr-28">
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <TopCard key={i} title={s.title} description={s.value} icon={s.icon} iconBgColor={s.bgColor} iconColor={s.color} />
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="price" stroke="#8b5cf6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="supply" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PENDING USERS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-bold text-xl mb-4">Pending User Verifications</h3>

        {loadingPending ? (
          <p>Loading...</p>
        ) : (
          pendingUsers.map((u) => (
            <div key={u.id} className="border p-4 rounded-lg mb-3">
              <p className="font-semibold">{u.email}</p>
              <p className="text-sm text-gray-500">{u.role}</p>

              <div className="flex gap-3 mt-3">
                <button onClick={() => handleApprove(u.id)} className="bg-green-700 text-white px-4 py-1 rounded">
                  Approve
                </button>
                <button onClick={() => handleReject(u.id)} className="bg-red-600 text-white px-4 py-1 rounded">
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ActivityTable activities={activities} />
    </div>
  );
};

export default AdminDashboard;
