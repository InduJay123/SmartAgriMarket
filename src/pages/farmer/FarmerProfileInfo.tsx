import {SettingsIcon } from "lucide-react";
import { useState , useEffect} from "react";
import Header from "../../components/farmer/Header";
import FarmerProfileImageUpload from "../../components/farmer/FarmerProfileImageUpload";
import { getFarmerProfile, updateFarmerProfile } from "../../api/farmer/farmerProfile";

const FarmerProfileInfo:React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        farmName: "",
        farmerName: "",
        email: "",
        contact: "",
        address: "",
        region: "",
        about: "",
        profileImage: "",
        price_alert: false,
        buyer_msg: false,
        harvest_rem: false,
        market_update: false,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getFarmerProfile();
                
                setFormData({
                    farmName: data.farmer_details?.farm_name || "",
                    farmerName: data.farmer_details?.fullname || "",
                    email: data.email || "",
                    contact: data.phone || "",
                    region: data.farmer_details?.region || "",
                    address: data.farmer_details?.address || "",
                    about: data.farmer_details?.about || "",
                    profileImage: data.farmer_details?.profile_image || "",
                    price_alert: data.farmer_details?.price_alert || false,
                    buyer_msg: data.farmer_details?.buyer_msg || false,
                    harvest_rem: data.farmer_details?.harvest_rem || false,
                    market_update: data.farmer_details?.market_update || false,
                });
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name } = target;

        let value: string | boolean;
        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            value = target.checked;
        } else {
            value = target.value;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleImageChange = (url: string) => {
        setFormData(prev => ({ ...prev, profileImage: url }));
    };

    const handleSave = async () => {
        try {
            await updateFarmerProfile({
                fullname: formData.farmerName,
                phone: formData.contact,
                region: formData.region,
                farm_name: formData.farmName,
                address: formData.address,
                about: formData.about,
                profile_image: formData.profileImage,
                price_alert: formData.price_alert,
                buyer_msg: formData.buyer_msg,
                harvest_rem: formData.harvest_rem,
                market_update: formData.market_update,
            });
            alert("Profile updated successfully");
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    if (loading) {
        return <p className="text-center">Loading profile...</p>;
    }


    return(
        <div className="bg-gray-50 p-4">
        <div>
          <h1 className="text-4xl text-black font-bold px-4 py-2">👤 Profile Settings</h1>
          <p className="text-md text-gray-500 mb-6 px-4">Manage your farm profile and preferences</p>
        </div>
            <div className="grid lg:grid-cols-2 gap-6 mt-6 mb-2">
                <div className="flex flex-col bg-white p-6 w-full shadow-md rounded-md border border-gray-200 items-start justify-start">
                    <h2 className="text-lg font-bold mb-4">Farm Information</h2>
                    <FarmerProfileImageUpload
                        image={formData.profileImage}
                        onChange={handleImageChange}
                    />
                    <form className="flex flex-col w-full items-start justify-start space-y-4">
                        <div className="flex flex-col items-start w-full">
                            <label className="text-gray-700 font-medium mb-1 block">Farm Name</label>
                            <input type="text" name="farmName" value={formData.farmName} onChange={handleChange}
                            className="bg-gray-0 border border-gray-200 rounded-xl px-3 py-1 w-full text-gray-600"/>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <label className="text-gray-700 font-medium mb-1 block">Farmer Name</label>
                            <input type="text" name="farmerName" value={formData.farmerName} onChange={handleChange}
                            className="bg-gray-0 border border-gray-200 rounded-xl px-3 py-1 w-full text-gray-600"/>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <label className="text-gray-700 font-medium mb-1 block">Email Address</label>
                            <input type="text" name="email" value={formData.email} onChange={handleChange}
                            className="bg-gray-0 border border-gray-200 rounded-xl px-3 py-1 w-full text-gray-600"/>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <label className="text-gray-700 font-medium mb-1 block">Contact Number</label>

                            <input type="text" name="contact" value={formData.contact} onChange={handleChange}
                             className="bg-gray-0 border border-gray-200 rounded-xl px-3 py-1 w-full text-gray-600"/>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <label className="text-gray-700 font-medium mb-1 block">Farm Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange}
                            className="bg-gray-0 border border-gray-200 rounded-xl px-3 py-1 w-full text-gray-600"/>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <label className="text-gray-700 font-medium mb-1 block">Region</label>
                            <input type="text" name="region" value={formData.region} onChange={handleChange}
                            className="bg-gray-0 border border-gray-200 rounded-xl px-3 py-1 w-full text-gray-600"/>
                        </div>              
                    </form>
                </div>

              <div className="flex-col">
                 <div className="flex flex-col items-start justify-start rounded-lg bg-white shadow-md p-6 border border-gray-200 w-full max-w-md mx-auto">
                    <h2 className="text-lg font-bold mb-4">Notification Preferences</h2>

                    {[
                    { name: "price_alert", label: "Price Alerts" },
                    { name: "buyer_msg", label: "Buyer Messages" },
                    { name: "harvest_rem", label: "Harvest Reminders" },
                    { name: "market_update", label: "Market Updates" },
                    ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between w-full mb-2">
                        <label className="text-gray-800 w-2/3">{item.label}</label>
                        <input
                        type="checkbox"
                        name={item.name}
                        checked={formData[item.name as keyof typeof formData] as boolean}
                        onChange={handleChange}
                        className="w-1/3 h-4"
                        />
                    </div>
                    ))}
                </div>

                <div className="flex flex-col items-start justify-start mt-6 mb-4 rounded-lg shadow-md border border-gray-200 p-4">
                    <h2 className="text-lg font-bold mb-4">About Your Farm</h2>
                    <textarea
                        className="w-full bg-gray-100 border border-gray-200 rounded-md text-gray-600 text-sm mb-4 p-4 resize-none min-h-[240px] max-h-[240px] overflow-auto"
                        value={formData.about}
                        onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                        />
                </div>

                <div className="flex justify-end w-full">
                <button 
                    onClick={handleSave}
                    className="flex items-end justify-end bg-green-700 text-white font-bold px-4 py-1 rounded-md hover:bg-green-800 transition-colors"> 
                    Save Changes
                </button>      
            </div>
              </div>
            </div>

            
        </div>
    )
}

export default FarmerProfileInfo;