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
 id: number;         // profile id (FarmerDetails/BuyerDetails)
  user_id: number;    // ✅ auth user id
  email: string;
  username: string;
  role: string; // "Farmer" | "Buyer"
  is_verified?: boolean;
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

  // farmer
  farm_name?: string;
  about?: string;

  // buyer
  company_name?: string;
  company_email?: string;
  company_phone?: string;
  address?: string;
  city?: string;

  is_active?: boolean;
}

const AdminDashboard: React.FC = () => {
  const [farmers, setFarmers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [buyers, setBuyers] = useState(0);
  const [crops, setCrops] = useState(0);

  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loadingPending, setLoadingPending] = useState(true);

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

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

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/auth/admin/dashboard-stats/");
      setFarmers(res.data.verified_farmers ?? 0);
      setPendingApprovals(res.data.pending_approvals ?? 0);
      setBuyers(res.data.buyers ?? 0);
      setCrops(res.data.crops ?? 0);
    } catch (err) {
      console.error("Dashboard stats error", err);
    }
  };

  const fetchPendingUsers = async () => {
    setLoadingPending(true);
    try {
      
      const res = await api.get("/auth/admin/farmers/");
      setPendingUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Pending users error", err);
      setPendingUsers([]);
    } finally {
      setLoadingPending(false);
    }
  };

  const openUserModal = async (u: PendingUser) => {
    setSelectedUser(u);
    setDetails(null);
    setDetailsError("");
    setOpen(true);

    setDetailsLoading(true);
    try {
      
      const res = await api.get(`/auth/admin/user/${u.id}/`);
      setDetails(res.data);
    } catch (err: any) {
      console.error("Load user details failed", err);
      setDetailsError(err?.response?.data?.error || "Failed to load user details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleApprove = async (u: PendingUser) => {
  const payload = { role: u.role, user_id: u.user_id, is_active: true };
  console.log("VERIFY PAYLOAD =>", payload);

  try {
    await api.patch("/auth/admin/verify/", payload);
    fetchPendingUsers();
    fetchDashboardStats();
  } catch (err) {
    console.error("Approve failed", err);
  }
};

const handleReject = async (u: PendingUser) => {
  const payload = { role: u.role, user_id: u.user_id, is_active: false };
  console.log("VERIFY PAYLOAD =>", payload);

  try {
    await api.patch("/auth/admin/verify/", payload);
    fetchPendingUsers();
    fetchDashboardStats();
  } catch (err) {
    console.error("Reject failed", err);
  }
};


  useEffect(() => {
    fetchDashboardStats();
    fetchPendingUsers();
  }, []);

  const stats = [
    { title: "Verified Farmers", value: farmers.toString(), icon: Users, color: "text-green-300", bgColor: "bg-green-50" },
    { title: "Pending Approvals", value: pendingApprovals.toString(), icon: AlertTriangle, color: "text-red-300", bgColor: "bg-red-50" },
    { title: "Buyers", value: buyers.toString(), icon: ShoppingCart, color: "text-blue-300", bgColor: "bg-blue-50" },
    { title: "Crops", value: crops.toString(), icon: Leaf, color: "text-amber-900", bgColor: "bg-amber-100" },
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
        ) : pendingUsers.length === 0 ? (
          <p className="text-gray-500">No pending users.</p>
        ) : (
          pendingUsers.map((u) => (
            <div key={u.id} className="border p-4 rounded-lg mb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{u.email}</p>
                  <p className="text-sm text-gray-500">{u.role}</p>
                </div>

                <button
                  onClick={() => openUserModal(u)}
                  className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-50"
                  title="View details"
                >
                  <Eye size={16} />
                  View
                </button>
              </div>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleApprove(u)}
                  className="inline-flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(u)}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />

          <Dialog.Content className="fixed left-1/2 top-1/2 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <Dialog.Title className="text-xl font-bold">User Details</Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500">
                  Review the profile and approve/reject.
                </Dialog.Description>
              </div>

              <Dialog.Close className="p-2 rounded-lg hover:bg-gray-100">
                ✕
              </Dialog.Close>
            </div>

            <div className="mt-4">
              {detailsLoading ? (
                <p className="text-gray-500">Loading details...</p>
              ) : detailsError ? (
                <p className="text-red-600">{detailsError}</p>
              ) : details ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Info label="Role" value={details.role} />
                    <Info label="Username" value={details.username || "—"} />
                    <Info label="Email" value={details.email || "—"} />
                    <Info label="Full Name" value={details.fullname || "—"} />
                    <Info label="Phone" value={details.contact_number || "—"} />
                    <Info label="Region/City" value={details.region || details.city || "—"} />
                  </div>

                  {details.role === "Farmer" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Info label="Farm Name" value={details.farm_name || "—"} />
                      <Info label="About" value={details.about || "—"} />
                      <Info label="Address" value={details.address || "—"} />
                    </div>
                  )}

                  {details.role === "Buyer" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Info label="Company Name" value={details.company_name || "—"} />
                      <Info label="Company Email" value={details.company_email || "—"} />
                      <Info label="Company Phone" value={details.company_phone || "—"} />
                      <Info label="Address" value={details.address || "—"} />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No details.</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {selectedUser && (
                <>
                  <button
                    onClick={() => handleReject(selectedUser)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>

                  <button
                    onClick={() => handleApprove(selectedUser)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                </>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ActivityTable activities={activities} />
    </div>
  );
};

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium text-gray-900 break-words">{value}</p>
    </div>
  );
}

export default AdminDashboard;
