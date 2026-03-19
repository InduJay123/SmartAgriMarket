import {
  Users,
  AlertTriangle,
  ShoppingCart,
  Leaf,
  Eye,
  XCircle,
  CheckCircle,
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

import * as Dialog from "@radix-ui/react-dialog";
import TopCard from "../../components/admin/TopCard";
import ActivityTable from "../../components/admin/ActivityTable";
import { useEffect, useState } from "react";
import api from "../../services/api";

interface PendingUser {
  id: number;
  user_id: number;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
}

interface UserDetails {
  id: number;
  role: "Farmer" | "Buyer";
  email?: string;
  username?: string;
  fullname?: string;
  contact_number?: string;
  region?: string;
  farm_name?: string;
  about?: string;
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  address?: string;
  city?: string;
}

interface PriceData {
  month: string;
  price: number;
}

interface SupplyData {
  crop: string;
  supply: number;
}

const mockPrice: PriceData[] = [
  { month: "Mar 17", price: 450 },
  { month: "Mar 18", price: 470 },
  { month: "Mar 19", price: 460 },
  { month: "Mar 20", price: 480 },
  { month: "Mar 21", price: 450 },
  { month: "Mar 22", price: 465 },
  { month: "Mar 23", price: 455 },
];

const mockSupply: SupplyData[] = [
  { crop: "Potato", supply: 640 },
  { crop: "Tomato", supply: 420 },
  { crop: "Carrot", supply: 300 },
];



const AdminDashboard: React.FC = () => {
  const [farmers, setFarmers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [buyers, setBuyers] = useState(0);
  const [crops, setCrops] = useState(0);

  const [priceData, setPriceData] = useState<PriceData[]>(mockPrice);
  const [supplyData, setSupplyData] = useState<SupplyData[]>(mockSupply);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/auth/admin/dashboard-stats/");

      setFarmers(res.data.verified_farmers ?? 0);
      setPendingApprovals(res.data.pending_approvals ?? 0);
      setBuyers(res.data.buyers ?? 0);
      setCrops(res.data.crops ?? 0);
    } catch {
      console.log("stats error");
    }
  };

  const fetchCharts = async () => {
    try {
      const res = await api.get("/auth/admin/dashboard-charts/");

      const labels = res.data?.price_trend?.labels || [];
      const values = res.data?.price_trend?.values || [];

      const mapped = labels.map((l: string, i: number) => ({
        month: l,
        price: Number(values[i] ?? 0),
      }));

      if (mapped.some((x: any) => x.price > 0)) {
        setPriceData(mapped);
      }

      const sLabels = res.data?.supply_by_crop?.labels || [];
      const sValues = res.data?.supply_by_crop?.values || [];

      const mappedSupply = sLabels.map((l: string, i: number) => ({
        crop: l,
        supply: Number(sValues[i] ?? 0),
      }));

      if (mappedSupply.length > 0) {
        setSupplyData(mappedSupply);
      }
    } catch {
      setPriceData(mockPrice);
      setSupplyData(mockSupply);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchCharts();
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

        {/* PRICE CHART */}
        <div className="bg-white p-4 rounded-xl shadow">

          <h3 className="mb-4 text-lg font-semibold">
            Price Forecast Chart
          </h3>

          <ResponsiveContainer width="100%" height={300}>

            <AreaChart data={priceData}>

              <defs>
                <linearGradient
                  id="priceGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#16a34a"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="50%"
                    stopColor="#22c55e"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="#ffffff"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Area
                type="monotone"
                dataKey="price"
                stroke="#16a34a"
                strokeWidth={3}
                fill="url(#priceGradient)"
                name="Predicted Price (LKR)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        {/* SUPPLY CHART */}

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

              <Bar
                dataKey="supply"
                fill="#10b981"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;