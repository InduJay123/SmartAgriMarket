import { useEffect, useMemo, useState } from "react";
import { Search, Filter as FilterIcon, Eye } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import api from "../../services/api";

type BuyerStatusFilter = "all" | "verified" | "pending" | "blocked";

interface BuyerApi {
  id: number;
  user_id?: number;
  email: string;
  username: string;
  phone?: string;
  role?: "BUYER";
  is_verified: boolean;
  is_active: boolean;

  location?: string;
  city?: string;
  type?: string;// Retailer/Wholesaler (optional)
  contact_number?: string; 
}

interface BuyerDetails {
  id: number;
  role?: string;
  email?: string;
  username?: string;
  fullname?: string;
  contact_number?: string;
  region?: string;
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  address?: string;
  city?: string;
  is_active?: boolean;
  is_verified?: boolean;
}

const isStatusMatch = (b: BuyerApi, filter: BuyerStatusFilter) => {
  if (filter === "all") return true;
  if (filter === "verified") return b.is_active && b.is_verified;
  if (filter === "pending") return b.is_active && !b.is_verified;
  return !b.is_active;
};

export default function ManageBuyers() {
  const [buyers, setBuyers] = useState<BuyerApi[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BuyerStatusFilter>("all");

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerApi | null>(null);
  const [viewDetails, setViewDetails] = useState<BuyerDetails | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/admin/buyers/");
      setBuyers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load buyers:", err);
      setBuyers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const filteredBuyers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return buyers
      .filter((b) => isStatusMatch(b, statusFilter))
      .filter((b) => {
        if (!q) return true;
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
  }, [buyers, search, statusFilter]);

  const getDisplayName = (b: BuyerApi) => b.username?.trim() || b.email;

  const getStatusBadge = (b: BuyerApi) => {
    if (!b.is_active) return { text: "Blocked", cls: "bg-red-100 text-red-800" };
    if (b.is_verified) return { text: "Verified", cls: "bg-green-100 text-green-800" };
    return { text: "Verified", cls: "bg-green-100 text-green-800" };
  };

  const getBuyerLocation = (b: BuyerApi) => b.city || "—";

  const openViewModal = async (b: BuyerApi) => {
    setSelectedBuyer(b);
    setViewDetails(null);
    setViewError("");
    setViewOpen(true);
    setViewLoading(true);
    try {
      const res = await api.get(`/auth/admin/user/${b.id}/`);
      setViewDetails(res.data);
    } catch (err: any) {
      setViewError(err?.response?.data?.error || "Failed to load buyer details.");
    } finally {
      setViewLoading(false);
    }
  };

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
                  <th className="text-left py-3 px-4">Contact Number</th>
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
                        {/* {b.contact_number ? (
                          <div className="text-xs text-gray-500">{b.contact_number}</div>
                        ) : null} */}
                      </td>

                      <td className="py-3 px-4">{b.contact_number || "077 9865540"}</td>
                      <td className="py-3 px-4">{getBuyerLocation(b)}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${badge.cls}`}
                        >
                          {badge.text}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => openViewModal(b)}
                          className="text-emerald-600 hover:text-emerald-800 p-2 hover:bg-emerald-200 rounded"
                          title="View details"
                        >
                          <Eye size={16} />
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

      <Dialog.Root open={viewOpen} onOpenChange={setViewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Dialog.Title className="text-xl font-bold">Buyer Details</Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500">
                  {selectedBuyer ? `${getDisplayName(selectedBuyer)} - ${selectedBuyer.email}` : ""}
                </Dialog.Description>
              </div>
              <Dialog.Close className="p-2 rounded-lg hover:bg-gray-100">✕</Dialog.Close>
            </div>

            {viewLoading ? (
              <p className="text-gray-500">Loading details...</p>
            ) : viewError ? (
              <p className="text-red-600">{viewError}</p>
            ) : viewDetails ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <InfoRow label="Username" value={viewDetails.username || "—"} />
                  <InfoRow label="Email" value={viewDetails.email || "—"} />
                  <InfoRow label="Full Name" value={viewDetails.fullname || "—"} />
                  <InfoRow label="Phone" value={viewDetails.contact_number || "—"} />
                  <InfoRow label="Region/City" value={viewDetails.region || viewDetails.city || "—"} />
                  <InfoRow label="Company Name" value={viewDetails.company_name || "—"} />
                  <InfoRow label="Company Email" value={viewDetails.company_email || "—"} />
                  <InfoRow label="Company Phone" value={viewDetails.company_phone || "—"} />
                  <InfoRow label="Address" value={viewDetails.address || "—"} />
                  <InfoRow
                    label="Status"
                    value={
                      !viewDetails.is_active
                        ? "Blocked"
                        : viewDetails.is_verified
                        ? "Verified"
                        : "Verified"
                    }
                  />
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No details available.</p>
            )}

            <div className="mt-6 flex justify-end">
              <Dialog.Close className="px-4 py-2 rounded-lg border hover:bg-gray-50">Close</Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900 break-words">{value}</p>
    </div>
  );
}
