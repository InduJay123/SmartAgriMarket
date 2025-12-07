import { LineChart, BarChart,Users, AlertTriangle, ShoppingCart, Leaf, CheckCircle, Eye, XCircle } from "lucide-react";


import * as Dialog from "@radix-ui/react-dialog";
import TopCard from "../../components/admin/TopCard";
import ActivityTable from "../../components/admin/ActivityTable";

const AdminDashboard: React.FC = () => {
  const priceData = [
    { month: "Jan", price: 110 },
    { month: "Feb", price: 90 },
    { month: "Mar", price: 70 },
    { month: "Apr", price: 150 },
    { month: "May", price: 100 },
    { month: "Jun", price: 80 }
  ];

  const supplyData = [
    { crop: "Carrots", supply: 65 },
    { crop: "Tomato", supply: 52 },
    { crop: "Onion", supply: 45 },
    { crop: "Potato", supply: 38 },
    { crop: "Chilli", supply: 18 }
  ];

  const activities = [
    { date: "2025-11-09", activity: "Uploaded new crop price data", user: "Admin" },
    { date: "2025-11-08", activity: "Verified farmer account #245", user: "Admin" },
    { date: "2025-11-08", activity: "Updated AI model parameters", user: "System" },
    { date: "2025-11-07", activity: "New buyer registration approved", user: "Admin" },
    { date: "2025-11-07", activity: "Generated monthly analytics report", user: "System" }
  ];

  const stats = [
    {
      title: "Verified Farmers",
      value: "248",
      icon: Users,
      color: "text-green-300",
      bgColor: "bg-green-50"
    },
    {
      title: "Pending Approvals",
      value: "3",
      icon: AlertTriangle,
      color: "text-red-300",
      bgColor: "bg-red-50"
    },
    {
      title: "Buyers",
      value: "156",
      icon: ShoppingCart,
      color: "text-blue-300",
      bgColor: "bg-blue-50"
    },
    {
      title: "Crops",
      value: "58",
      icon: Leaf,
      color: "text-amber-900",
      bgColor: "bg-amber-100"
    }
  ];

  const pendingUsers = [
    { id: 1, name: "Sunil Perera", type: "Farmer", region: "Kandy", date: "2024-05-10", nic: "892345678V" },
    { id: 2, name: "Kamala Foods", type: "Buyer", region: "Colombo", date: "2024-05-11", business: "Food Distribution" },
    { id: 3, name: "Nimal Silva", type: "Farmer", region: "Badulla", date: "2024-05-12", nic: "856789012V" }
  ];

  const handleApprove = (_id: number) => {
    alert("User approved successfully");
  };

  const handleReject = (_id: number) => {
    alert("User verification rejected");
  };

  return (
    <div className="space-y-6 pr-28">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-1">
        {stats.map((stat, index) => (
          <TopCard
            key={index}
            title={stat.title}
            description={stat.value}
            icon={stat.icon}
            iconBgColor={stat.bgColor}
            iconColor={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart data={priceData} title="Tomato Prices - Last 6 Months" />
        <BarChart data={supplyData} title="Top 5 Crops by Supply" />
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 mb-4 font-heading flex flex-col items-start gap-2">
        <div className="flex font-bold text-xl gap-4 mb-2">
          <Users className="h-5 w-5" />
          Pending User Verifications
        </div>

        <div className="space-y-4 w-full px-4 pr-4">
          {pendingUsers.map(user => (
            <div key={user.id} className="bg-muted/30 border border-gray-300 rounded-lg pr-4">
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-xs text-muted-foreground">{user.type} • {user.region}</p>
                    <p className="text-xs text-muted-foreground mt-1">Applied: {user.date}</p>
                  </div>

                  <div className="bg-amber-800/50 px-2 rounded-xl text-xs text-black">
                    {user.type}
                  </div>
                </div>

                <div className="flex gap-8 px-6">
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <button className="flex-1 border border-gray-200 bg-gray-50 rounded-xl hover:bg-red-600/90 hover:text-white">
                        <div className="flex items-center gap-4 justify-center font-medium">
                          <Eye size={20} />
                          Review
                        </div>
                      </button>
                    </Dialog.Trigger>

                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

                      <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-4 shadow-xl">
                        <Dialog.Title className="font-bold text-lg mb-4">
                          User Verification Details
                        </Dialog.Title>

                        <div className="space-y-2">
                          <div>
                            <label className="text-sm">Name</label>
                            <p className="font-medium">{user.name}</p>
                          </div>

                          <div>
                            <label className="text-sm">Type</label>
                            <p className="font-medium">{user.type}</p>
                          </div>

                          <div>
                            <label className="text-sm">Region</label>
                            <p className="font-medium">{user.region}</p>
                          </div>

                          {user.nic && (
                            <div>
                              <label className="text-sm">NIC</label>
                              <p className="font-medium">{user.nic}</p>
                            </div>
                          )}

                          {user.business && (
                            <div>
                              <label className="text-sm">Business Type</label>
                              <p className="font-medium">{user.business}</p>
                            </div>
                          )}

                          <div className="flex gap-2 px-4 pt-4">
                            <button
                              onClick={() => handleApprove(user.id)}
                              className="flex-1 bg-green-800/90 text-white rounded-xl"
                            >
                              <div className="flex items-center gap-4 justify-center font-medium">
                                <CheckCircle className="h-4 w-4" /> Approve
                              </div>
                            </button>

                            <button
                              onClick={() => handleReject(user.id)}
                              className="flex-1 bg-red-600 text-white rounded-xl"
                            >
                              <div className="flex items-center gap-4 justify-center font-medium">
                                <XCircle className="h-4 w-4" /> Reject
                              </div>
                            </button>
                          </div>
                        </div>

                        <Dialog.Close className="absolute top-3 right-4 text-gray-500 hover:text-black">
                          ✕
                        </Dialog.Close>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>

                  <button
                    onClick={() => handleApprove(user.id)}
                    className="flex-1 bg-green-800/90 text-white rounded-xl"
                  >
                    <div className="flex items-center gap-4 justify-center font-medium">
                      <CheckCircle className="h-4 w-4" /> Approve
                    </div>
                  </button>

                  <button
                    onClick={() => handleReject(user.id)}
                    className="p-2 bg-red-600 text-white rounded-xl"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ActivityTable activities={activities} />
    </div>
  );
};

export default AdminDashboard;
