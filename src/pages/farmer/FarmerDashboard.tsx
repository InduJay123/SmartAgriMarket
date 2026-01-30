import { Calendar, DollarSign, Edit, MessageSquare, PlusCircle, Trash2, TrendingUp} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/farmer/Header";
import TopCard from "../../components/farmer/TopCard";
import EditCrop from "../../components/farmer/EditCrop";
import ReviewPopup from "../../components/farmer/ReviewPopup";
import { deleteCrop, fetchCrops } from "../../api/farmer/marketplace";

interface Crop {
    market_id: number;
    crop_name: string;
    quantity: number;
    predicted_date: number;
    price: number;
    unit: string;
    farming_season: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const FarmerDashboard: React.FC = () => {
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const stats = [
        {
            title: "Market Price",
            value:"Rs. 250/kg",
            subTitle:"Tomato avg",
            icon: DollarSign,
            color:"text-green-300",
            bgColor:"bg-green-50"           
        },
        {
            title: "Demand Forecast",
            value:"High",
            subTitle:"Next Week",
            icon:TrendingUp,
            color:"text-blue-300" ,
            bgColor:"bg-green-50"           
        },
        {
            title: "Harvest Alerts",
            value:"3 Active",
            subTitle:"Due this month",
            icon: Calendar,
            color:"text-orange-300",
            bgColor:"bg-orange-50"            
        },
        {
            title: "Messages",
            value:"5 New",
            subTitle:"From buyers",
            icon:MessageSquare,
            color:"text-amber-900" ,
            bgColor:"bg-amber-100"           
        },
    ]

    const cropEmojiMap: Record<string, string> = {
        "Rice": "🌾",
        "Paddy": "🌾",
        "Wheat": "🌾",
        "Corn": "🌽",
        "Cabbage": "🥬",
        "Maize": "🌽",
        "Tomato": "🍅",
        "Potato": "🥔",
        "Carrot": "🥕",
        "Banana": "🍌",
        "Beans": "🫘",
        "Apple": "🍎",
        "Orange": "🍊",
        "Mango": "🥭",
        "Grapes": "🍇",
        "Brinjal": "🍆",
        "Eggplant": "🍆",
        "Chili": "🌶️",
        "Pumpkin": "🎃",
        "Coconut": "🥥",
        "Lemon": "🍋",
        "Strawberry": "🍓",
        "Papaya": "🥭",
        "Pineapple": "🍍",
        "Onion":  "🧅"
    };

    const navigate = useNavigate();
    const [crops, setCrops] = useState<Crop[]>([])
    const [selectedCrop, setSelectedCrop] = useState(null);

    useEffect(() => {
        const loadCrops = async () => {
            try {
                const data = await fetchCrops();
                setCrops(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching crops:", error);
            }
        };
        loadCrops();
    }, []);
    
    const getCropEmoji = (name: string | undefined) => {
        if (!name) return "🌾"; // fallback

        const normalized = name.trim().toLowerCase();
        
        const emoji = cropEmojiMap[
            Object.keys(cropEmojiMap).find(key => key.toLowerCase() === normalized) || ""
        ];

        return emoji || "🌾"; // fallback emoji
    };

    const handleAddCrop = () => { navigate('/farmer/addcrops') };
    const handleEditCrop = (crop) => { setSelectedCrop(crop)};

    const refreshCrops = async () => {
        try {
            const data = await fetchCrops();
            setCrops(data);
        } catch (error) {
            console.error("Error refreshing crops:", error);
        }
    };
   
    const handleDeleteCrop = async (marketId: number) => {
        if (!window.confirm("Are you sure you want to delete this crop?")) return;

        try {
            await deleteCrop(marketId);
            setCrops(prev => prev.filter(crop => crop.market_id !== marketId));
            alert("Crop deleted successfully!");
        } catch (error) {
            console.error("Error deleting crop:", error);
            alert("Failed to delete crop");
        }
    };



    return(
        <div className="bg-gray-50 p-4 sm:p-6 lg:p-4 min-h-screen w-full">

            <Header/>

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

            <div className=" bg-white border border-gray-200 rounded-xl shadow-lg mt-8 p-4 sm:p-6">
                <div className="flex flex-wrap sm: gap-2 items-center justify-between w-full">
                    <div className="flex flex-col items-start justify-start">
                        <h2 className="text-xl font-bold mb-2">My Crops</h2>
                        <p className="text-xs text-gray-500">Manage your farm produce</p>
                    </div>
                    <button 
                        onClick={handleAddCrop}
                        className="flex items-center gap-3 bg-green-800 rounded-xl py-2 px-4 text-white text-sm font-semibold sm:w-auto">
                        <PlusCircle size={16} className="font-semibold"/> Add New Crop
                    </button>
                </div>

            {crops.map((crop, index) => (
                <div
                key={crop.market_id || index}
                className="bg-white shadow-md rounded-lg p-4 mb-4 border sm:hidden"
                >
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCropEmoji(crop.crop_name)}</span>
                    <span className="font-semibold">{crop.crop_name}</span>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => setSelectedProductId(crop.market_id)}>
                            Reviews
                        </button>
                        <button 
                            onClick={() => handleEditCrop(crop)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200">
                                <Edit className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDeleteCrop(crop.market_id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-100">
                                <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-semibold">Expected Qty:</span> {crop.quantity}{crop.unit}</p>
                    <p><span className="font-semibold">Expected Date:</span> {crop.predicted_date}</p>
                    <p><span className="font-semibold">Price:</span> Rs. {crop.price}</p>
                    <p><span className="font-semibold">Season:</span>{crop.farming_season}</p>
                    <p><span className="font-semibold">Status:</span> {crop.status}</p>
                </div>
                </div>
            ))}
               
                <div className="mt-4 p-2 overflow-x-auto hidden sm:block">
                    <table className="min-w-[700px] w-full text-sm">
                        <thead className="text-sm text-gray-500 bg-gray-100 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left">Crop</th>
                                <th className="px-6 py-4 text-left">Expected Quantity/kg</th>
                                <th className="px-4 py-4 text-left">Expected Date</th>
                                <th className="px-10 py-4 text-left">Price/Rs</th>
                                <th className="px-10 py-4 text-left">Season</th>
                                <th className="px-10 py-4 text-left">Status</th>
                                <th className="px-10 py-4 text-center">Actions</th>
                            </tr>
                        </thead>  
                        <tbody>
                            {crops.map((crop,index) => (
                                <tr key={crop.market_id || index} className="border-t  hover:bg-gray-100 font-semibold text-gray-800">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl"> {getCropEmoji(crop.crop_name)} </span>
                                            <span> {crop.crop_name} </span>
                                        </div>
                                    </td>
                                    <td className="text-sm px-6 py-4">{crop.quantity} {crop.unit} </td>
                                    <td className="text-sm px-2 py-4">{crop.predicted_date}</td>
                                    <td className="text-sm px-10 py-4">{crop.price}</td>
                                    <td className="text-xs px-10 py-4">
                                        <span
                                            className={`px-2 py-1 w-full rounded-xl text-black ${
                                            crop.farming_season === "Yala"
                                                ? "bg-green-300"
                                                : crop.farming_season === "Maha"
                                                ? "bg-orange-300"
                                                : "bg-gray-300"
                                            }`}
                                        >
                                            {crop.farming_season ?? "Unknown"}
                                        </span>
                                    </td>

                                    <td className="text-sm px-10 py-4">{crop.status}</td>
                                    <td className="flex gap-10 px-8 py-4">
                                      
                                     <div className="flex items-center justify-end space-x-2">
                                        <button onClick={() => setSelectedProductId(crop.market_id)}>
                                            Reviews
                                        </button>

                                        <button  
                                            onClick={() => handleEditCrop(crop)}
                                            className="w-8 h-8 p-2 rounded-lg hover:bg-gray-200">
                                            <Edit className="w-4 h-4 hover:text-white" />
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleDeleteCrop(crop.market_id)}
                                            className="w-8 h-8 p-2 rounded-lg text-red-700 hover:bg-red-100">
                                            <Trash2 className="w-4 h-4 hover:text-white" />
                                        </button>
                                     </div>
                                    </td>
                                </tr>
                            ))}
                         </tbody>              
                    </table>                   
                </div>
                {selectedCrop && (
                    <EditCrop crop={selectedCrop} onClose={() => {setSelectedCrop(null); refreshCrops();} }/>                     
                )}
                {selectedProductId && (
                <ReviewPopup
                    productId={selectedProductId}
                    onClose={() => setSelectedProductId(null)}
                />
                )}

            </div>
            
        </div>
    )
}

export default FarmerDashboard;