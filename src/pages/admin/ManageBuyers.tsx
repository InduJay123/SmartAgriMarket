import { useEffect, useMemo, useState } from "react";
import { Search, Filter as FilterIcon, Eye, Trash2 } from "lucide-react";
import api from "../../services/api";

type BuyerStatusFilter = "all" | "verified" | "pending" | "blocked";

interface BuyerApi {
  id: number;
  email: string;
  username: string;
  phone?: string;
  role?: "BUYER";
  is_verified: boolean;
  is_active: boolean;

  location?: string;
  type?: string; // Retailer/Wholesaler (optional)
}

export default function ManageBuyers() {
  const [buyers, setBuyers] = useState<BuyerApi[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BuyerStatusFilter>("all");

  const fetchBuyers = async (filter: BuyerStatusFilter) => {
    setLoading(true);
    try {
      const url =
        filter === "all"
          ? "/auth/admin/buyers/"
          : `/auth/admin/buyers/?status=${filter}`;

      const res = await api.get(url);
      setBuyers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load buyers:", err);
      setBuyers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers("all");
  }, []);

  useEffect(() => {
    fetchBuyers(statusFilter);
  }, [statusFilter]);

  const filteredBuyers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return buyers;

    return buyers.filter((b) => {
      const username = (b.username || "").toLowerCase();
      const email = (b.email || "").toLowerCase();
      const phone = (b.phone || "").toLowerCase();
      const location = (b.location || "").toLowerCase();
      const type = (b.type || "").toLowerCase();
      return (
        username.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        location.includes(q) ||
        type.includes(q)
      );
    });
  }, [buyers, search]);

  const getDisplayName = (b: BuyerApi) => b.username?.trim() || b.email;

  const getStatusBadge = (b: BuyerApi) => {
    if (!b.is_active) return { text: "Blocked", cls: "bg-red-100 text-red-800" };
    if (b.is_verified) return { text: "Verified", cls: "bg-green-100 text-green-800" };
    return { text: "Pending", cls: "bg-yellow-100 text-yellow-800" };
  };

  const getBuyerType = (b: BuyerApi) => b.type || "—";
  const getBuyerLocation = (b: BuyerApi) => b.location || "—";

  return (
    <div className="space-y-6 pr-28">
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl lg:text-2xl font-bold">Buyers Management</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search buyers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <FilterIcon size={18} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as BuyerStatusFilter)}
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
          <div className="py-10 text-center text-gray-500">Loading buyers...</div>
        ) : filteredBuyers.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No buyers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredBuyers.map((b) => {
                  const badge = getStatusBadge(b);
                  return (
                    <tr
                      key={b.id}
                      className="border-b border-gray-100 hover:bg-gray-50 text-gray-600"
                    >
                      <td className="py-3 px-4">#{b.id}</td>

                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {getDisplayName(b)}
                        <div className="text-xs text-gray-500">{b.email}</div>
                        {b.phone ? (
                          <div className="text-xs text-gray-500">{b.phone}</div>
                        ) : null}
                      </td>

                      <td className="py-3 px-4">{getBuyerType(b)}</td>
                      <td className="py-3 px-4">{getBuyerLocation(b)}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${badge.cls}`}
                        >
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
}
