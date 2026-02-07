import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Search,
  Filter as FilterIcon,
  AlertTriangle,
  Leaf,
  ShoppingCart,
  Users,
  Eye,
  Trash2,
} from "lucide-react";
import TopCard from "../../components/admin/TopCard";
import api from "../../services/api";

type FarmerStatusFilter = "all" | "verified" | "pending" | "blocked";

interface FarmerApi {
  id: number;
  email: string;
  username: string;
  phone: string;
  // role: "FARMER";
  is_verified: boolean;
  is_active: boolean;
}

const ManageFarmers: React.FC = () => {
  const [verifiedFarmersCount, setVerifiedFarmersCount] = useState(0);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);

  const [farmers, setFarmers] = useState<FarmerApi[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [buyers, setBuyers] = useState(0);
  const [crops, setCrops] = useState(0);

  const [showMap, setShowMap] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FarmerStatusFilter>("all");

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/auth/admin/dashboard-stats/");
      setVerifiedFarmersCount(res.data.verified_farmers);
      setPendingApprovalsCount(res.data.pending_approvals);
      setBuyers(res.data.buyers);
      setCrops(res.data.crops);
    } catch (err) {
      console.error("Dashboard stats error", err);
    }
  };

  const fetchFarmers = async (filter: FarmerStatusFilter) => {
    setLoading(true);
    try {
      const url =
        filter === "all"
          ? "/auth/admin/farmers/"
          : `/auth/admin/farmers/?status=${filter}`;

      const res = await api.get(url);

      console.log("farmers response:", res.data);

      setFarmers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load farmers:", err);
      setFarmers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchFarmers("all");
  }, []);

  useEffect(() => {
    fetchFarmers(statusFilter);
  }, [statusFilter]);

  const filteredFarmers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return farmers;
    return farmers.filter((f) => {
      const name = (f.username || f.email || "").toLowerCase();
      const email = (f.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [farmers, search]);

  const getDisplayName = (f: FarmerApi) => f.username?.trim() || f.email;

  const getStatusBadge = (f: FarmerApi) => {
    if (!f.is_active) {
      return { text: "Blocked", cls: "bg-red-100 text-red-800" };
    }
    if (f.is_verified) {
      return { text: "Verified", cls: "bg-green-100 text-green-800" };
    }
    return { text: "Pending", cls: "bg-yellow-100 text-yellow-800" };
  };

  const stats = [
    {
      title: "Verified Farmers",
      value: verifiedFarmersCount.toString(),
      subTitle: "",
      icon: Users,
      color: "text-green-300",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Approvals",
      value: pendingApprovalsCount.toString(),
      subTitle: "",
      icon: AlertTriangle,
      color: "text-red-300",
      bgColor: "bg-red-50",
    },
    {
      title: "Buyers",
      value: buyers.toString(),
      subTitle: "",
      icon: ShoppingCart,
      color: "text-blue-300",
      bgColor: "bg-blue-50",
    },
    {
      title: "Crops",
      value: crops.toString(),
      subTitle: "",
      icon: Leaf,
      color: "text-amber-900",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="space-y-6 pr-28">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-1">
        {stats.map((stat, index) => (
          <TopCard
            key={index}
            title={stat.title}
            description={stat.value}
            bottomText={stat.subTitle}
            icon={stat.icon}
            iconBgColor={stat.bgColor}
            iconColor={stat.color}
          />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl lg:text-2xl font-bold">Farmers Location</h2>
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <MapPin size={18} />
            {showMap ? "Hide Map" : "Show Map"}
          </button>
        </div>

        {showMap && (
          <div className="mb-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-8 lg:p-12 border-2 border-emerald-200 mt-4">
            <div className="flex items-center justify-center h-64 lg:h-96">
              <div className="text-center">
                <MapPin size={48} className="mx-auto text-emerald-600 mb-4" />
                <p className="text-gray-600 text-lg">Interactive Map View</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl lg:text-2xl font-bold">Farmers Details</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search farmers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <FilterIcon size={18} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FarmerStatusFilter)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading farmers...</div>
        ) : filteredFarmers.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No farmers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Phone</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((f) => {
                  const badge = getStatusBadge(f);
                  return (
                    <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">#{f.id}</td>
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {getDisplayName(f)}
                        <div className="text-xs text-gray-500">{f.email}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{f.phone || "—"}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.cls}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-emerald-600 hover:text-emerald-800 p-2 hover:bg-emerald-200 rounded">
                          <Eye size={16} />
                        </button>
                        <button className="text-red-600 hover:bg-red-200 p-2 hover:text-red-800 rounded">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFarmers;
