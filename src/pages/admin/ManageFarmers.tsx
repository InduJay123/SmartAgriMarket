import { useEffect, useState } from 'react';
import { MapPin, Search, Filter, AlertTriangle, Leaf, ShoppingCart, Users, Eye, Trash2 } from 'lucide-react';
import TopCard from '../../components/admin/TopCard';
import api from "../../services/api";


const farmers = [
  { id: 1, name: 'M.A premadasa', location: 'Weeraketiya', crops: 'Pumpkin, Wheat', verified: true },
  { id: 2, name: 'P.V.G Nalin', location: 'Walasmulla', crops: 'Beetroot, Cucumber', verified: true },
  { id: 3, name: 'A.K kristi', location: 'Meegasara', crops: 'Sugarcane, Potato', verified: false },
  { id: 4, name: 'J.J Janith', location: 'Hakmana', crops: 'Snake gourd, Beetroot', verified: true },
  { id: 5, name: 'S.A Dayanga', location: 'Nuwara', crops: 'Carrot, Leeks', verified: true },
];


 
const ManageFarmers:React.FC = () => {

 const [farmer, setFarmers] = useState(0);
 const [pendingApprovals, setPendingApprovals] = useState(0);


  const stats = [
        {
            title: "Verified Farmers",
            value:farmer.toString(),
            subTitle:"",
            icon: Users,
            color:"text-green-300",
            bgColor:"bg-green-50"           
        },
        {
            title: "Pending Approvals",
            value:pendingApprovals.toString(),
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
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
       const response = await api.get("/dashboard/stats");
        // console.log("Farmers fetched", response.data);
        setFarmers(response.data.verified_farmers);
        setPendingApprovals(response.data.pending_approvals);
      } catch (error) {
        console.error("Error fetching farmers:", error);
      }



      
    };

    
    fetchData();
  }, []);

  return (
    <div className="space-y-6 pr-28">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-1">
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

      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl lg:text-2xl font-bold">Farmers Location</h2>
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <MapPin size={18} />
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>

        {showMap && (
          <div className="mb-6 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-8 lg:p-12 border-2 border-emerald-200">
            <div className="flex items-center justify-center h-64 lg:h-96">
              <div className="text-center">
                <MapPin size={48} className="mx-auto text-emerald-600 mb-4" />
                <p className="text-gray-600 text-lg">Interactive Map View</p>
                <p className="text-sm text-gray-500 mt-2">Farmers distributed across India</p>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search farmers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50  font-semibold text-gray-700">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Location</th>
                <th className="text-left py-3 px-4">Crops</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((farmer) => (
                <tr key={farmer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">#{farmer.id}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{farmer.name}</td>
                  <td className="py-3 px-4 text-gray-600">{farmer.location}</td>
                  <td className="py-3 px-4 text-gray-600">{farmer.crops}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        farmer.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {farmer.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-emerald-600  hover:text-emerald-800 p-2 hover:bg-emerald-200 border-none">
                      <Eye size={16}/>
                    </button>
                    <button className="text-red-600 hover:bg-red-200 p-2 hover:text-red-800 border-none">
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageFarmers;