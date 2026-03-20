import {
  Users,
  AlertTriangle,
  ShoppingCart,
  Leaf,
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import TopCard from "../../components/admin/TopCard";
import { useEffect, useState } from "react";
import api from "../../api/api"; 

interface PriceData {
  crop: string;
  price: number;
}

interface SupplyData {
  crop: string;
  supply: number;
}

const AdminDashboard: React.FC = () => {
  const [farmers, setFarmers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [buyers, setBuyers] = useState(0);
  const [crops, setCrops] = useState(0);

  // ✅ REAL DATA STATES (NO MOCK)
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [supplyData, setSupplyData] = useState<SupplyData[]>([]);

  // ---------------- STATS ----------------
  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/dashboard/admin/dashboard-stats/");

      setFarmers(res.data.verified_farmers ?? 0);
      setPendingApprovals(res.data.pending_approvals ?? 0);
      setBuyers(res.data.buyers ?? 0);
      setCrops(res.data.crops ?? 0);
    } catch (err) {
      console.log("stats error", err);
    }
  };

  // ---------------- PRICE CHART ----------------
  const fetchPriceChart = async () => {
    try {
      const res = await api.get("/dashboard/admin/price-chart/");

      const labels = res.data?.labels || [];
      const values = res.data?.values || [];

      const mapped = labels.map((label: string, i: number) => ({
        crop: label,
        price: Number(values[i] ?? 0),
      }));

      setPriceData(mapped);

    } catch (err) {
      console.error("Price chart error", err);
      setPriceData([]);
    }
  };

  // ---------------- LOAD ----------------
  useEffect(() => {
    fetchDashboardStats();
    fetchPriceChart();
  }, []);

  const stats = [
    {
      title: "Verified Farmers",
      value: farmers.toString(),
      icon: Users,
      bgColor: "bg-green-50",
      color: "text-green-600",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovals.toString(),
      icon: AlertTriangle,
      bgColor: "bg-red-50",
      color: "text-red-600",
    },
    {
      title: "Buyers",
      value: buyers.toString(),
      icon: ShoppingCart,
      bgColor: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      title: "Crops",
      value: crops.toString(),
      icon: Leaf,
      bgColor: "bg-amber-100",
      color: "text-amber-700",
    },
  ];

  return (
    <div className="space-y-6 pr-28">

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <TopCard
            key={i}
            title={s.title}
            description={s.value}
            icon={s.icon}
            iconBgColor={s.bgColor}
            iconColor={s.color}
          />
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 🔥 PRICE CHART (REAL DATA) */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="mb-4 text-lg font-semibold">
            Crop Price Overview
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={priceData}>

              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              {/* 🔥 CHANGED FROM month → crop */}
              <XAxis dataKey="crop" />

              <YAxis />
              <Tooltip />
              <Legend />

              <Area
                type="monotone"
                dataKey="price"
                stroke="#16a34a"
                strokeWidth={3}
                fill="url(#priceGradient)"
                name="Average Price (LKR)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* SUPPLY CHART (OPTIONAL STATIC) */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="mb-4 text-lg font-semibold">
            Supply by Crop
          </h3>

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
    </div>
  );
};

export default AdminDashboard;