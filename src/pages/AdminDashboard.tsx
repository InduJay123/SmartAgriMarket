import { LineChart, BarChart,Users, AlertTriangle, ShoppingCart, Leaf, CheckCircle, Eye, XCircle } from "lucide-react";
import ActivityTable from "../components/admin/ActivityTable";
import TopCard from "./TopCard";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";

const AdminDashboard:React.FC = () => {

    const priceData = [
    { month: 'Jan', price: 110 },
    { month: 'Feb', price: 90 },
    { month: 'Mar', price: 70 },
    { month: 'Apr', price: 150 },
    { month: 'May', price: 100 },
    { month: 'Jun', price: 80 },
  ];

  const supplyData = [
    { crop: 'Carrots', supply: 65 },
    { crop: 'Tomato', supply: 52 },
    { crop: 'Onion', supply: 45 },
    { crop: 'Potato', supply: 38 },
    { crop: 'Chilli', supply: 18 },
  ];

  const activities = [
    { date: '2025-11-09', activity: 'Uploaded new crop price data', user: 'Admin' },
    { date: '2025-11-08', activity: 'Verified farmer account #245', user: 'Admin' },
    { date: '2025-11-08', activity: 'Updated AI model parameters', user: 'System' },
    { date: '2025-11-07', activity: 'New buyer registration approved', user: 'Admin' },
    { date: '2025-11-07', activity: 'Generated monthly analytics report', user: 'System' },
  ];

  const stats = [
        {
            title: "Verified Farmers",
            value:"248",
            subTitle:"",
            icon: Users,
            color:"text-green-300",
            bgColor:"bg-green-50"           
        },
        {
            title: "Pending Approvals",
            value:"3",
            subTitle:"",
            icon:AlertTriangle,
            color:"text-red-300" ,
            bgColor:"bg-red-50"           
        },
        {
            title: "Buyers",
            value:"156",
            subTitle:"",
            icon: ShoppingCart,
            color:"text-blue-300",
            bgColor:"bg-blue-50"            
        },
        {
            title: "Crops",
            value:"58",
            subTitle:"",
            icon:Leaf,
            color:"text-amber-900" ,
            bgColor:"bg-amber-100"           
        },
  ];

  const pendingUsers = [
    { id: 1, name: "Sunil Perera", type: "Farmer", region: "Kandy", date: "2024-05-10", nic: "892345678V" },
    {id: 2, name: "Kamala Foods", type: "Buyer", region: "Colombo", date: "2024-05-11", business: "Food Distribution" },
    {id: 3, name: "Nimal Silva", type: "Farmer", region: "Badulla", date: "2024-05-12", nic: "856789012V" },
  ];

  const handleApprove = (id: number) => {
    alert("User approved successfully");
  };

  const handleReject = (id: number) => {
    alert("User verification rejected");
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
        {stats.map((stat, index) => (
          <TopCard key={index}  
            title={stat.title}
            description={stat.value}
            bottomText={stat.subTitle}
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

        <div className="bg-white border rounded-xl  shadow-sm p-4 mb-4font-heading flex flex-col items-start gap-2">
            <div className="flex font-bold text-xl gap-4 mb-2">
              <Users className="h-5 w-5" />
              Pending User Verifications
            </div>
              <div className="space-y-4 w-full">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="bg-muted/30 border border-gray-300 rounded-lg">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {user.type} • {user.region}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Applied: {user.date}
                          </p>
                        </div>
                        <div className="bg-amber-800/50 px-2 rounded-xl text-xs text-black">{user.type}</div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="flex-1 border border-gray-200 bg-gray-50 rounded-xl">
                              <div className="flex items-center gap-4 justify-center font-medium">
                                <Eye size={20}/>
                                Review
                              </div>
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            
                              <p>User Verification Details</p>
                            
                            <div className="space-y-4">
                              <div>
                                <label>Name</label>
                                <p className="font-medium">{user.name}</p>
                              </div>
                              <div>
                                <label>Type</label>
                                <p className="font-medium">{user.type}</p>
                              </div>
                              <div>
                                <label>Region</label>
                                <p className="font-medium">{user.region}</p>
                              </div>
                              {user.nic && (
                                <div>
                                  <label>NIC</label>
                                  <p className="font-medium">{user.nic}</p>
                                </div>
                              )}
                              {user.business && (
                                <div>
                                  <label>Business Type</label>
                                  <p className="font-medium">{user.business}</p>
                                </div>
                              )}
                              <div className="flex gap-2 pt-4">
                                <button 
                                  onClick={() => handleApprove(user.id)}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleReject(user.id)}
                                  className="flex-1"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <button 
                          
                          onClick={() => handleApprove(user.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button    
                          onClick={() => handleReject(user.id)}
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
}

export default AdminDashboard;
