import {SettingsIcon } from "lucide-react";
import { useState } from "react";
import Header from "../../components/farmer/Header";


const Settings:React.FC = () => {

    const [formData, setFormData] = useState({
        farmName: "Naha's Farm",
        ownerName: "Neha Miheli",
        contact:"+94 70 707 7777",
        region: "dambulla",
        about: " We are family-owned farm in Dambullaspecializing in fresh vegetables. We use organic farming methods and sustainable practices"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return(
        <div className="bg-gray-50 p-4">
            <Header icon={SettingsIcon} title="Settings" subTitle="Manage your farm profile and preferences"/>
            <div className="grid lg:grid-cols-2 gap-6 mt-6 mb-2">
                <div className="flex flex-col bg-white p-6 w-full shadow-md rounded-md border border-gray-200 items-start justify-start">
                    <h2 className="text-lg font-bold mb-4">Farm Information</h2>
                    <form className="flex flex-col items-start justify-start space-y-4">
                        <div className="flex flex-col items-start w-full">
                            <label className="text-gray-700 font-medium mb-1 block">Farm Name</label>
                            <input type="text" name="farmName" value={formData.farmName}
                            className="bg-gray-0 border border-gray-200 rounded-xl px-3 py-1 w-full text-gray-600"/>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <label className="text-gray-700 font-medium mb-1 block">Owner Name</label>
                            <input type="text" name="ownerName" value={formData.ownerName} 
                            className="bg-gray-0 border border-gray-200 rounded-xl px-3 py-1 w-full text-gray-600"/>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <label className="text-gray-700 font-medium mb-1 block">Contact Number</label>
                            <input type="text" name="contact" value={formData.contact}
                             className="bg-gray-0 border border-gray-200 rounded-xl px-3 py-1 w-full text-gray-600"/>
                        </div>
                        <div className="flex flex-col items-start w-full">
                            <label className="text-gray-700 font-medium mb-1 block">Region</label>
                            <select name="region" value={formData.region} onChange={handleChange}
                            className="bg-white border border-gray-200 rounded-xl px-3 py-2 w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400">
                                <option value={formData.region}>{formData.region}</option>
                                <option value="nuwara-eliya">Nuwara-Eliya</option>
                                <option value="ratnapura">Ratnapura</option>
                                <option value="dambulla">Dambulla</option>
                            </select>
                        </div>               
                    </form>
                </div>

               <div className="flex flex-col items-start justify-start rounded-lg bg-white shadow-md p-6 border border-gray-200 w-full max-w-md mx-auto">
                    <h2 className="text-lg font-bold mb-4">Notification Preferences</h2>

                    <div className="flex justify-between items-center mb-2 w-full">
                        <label htmlFor="priceAlert" className="text-black">Price Alerts</label>
                        <input type="checkbox" id="priceAlert" name="priceAlert" className="w-4 h-4"/>
                    </div>

                    <div className="flex justify-between items-center mb-2 w-full">
                        <label htmlFor="buyerMsg" className="text-black">Buyer Messages</label>
                        <input type="checkbox" id="buyerMsg" name="buyerMsg" className="w-4 h-4"/>
                    </div>

                    <div className="flex justify-between items-center mb-2 w-full">
                        <label htmlFor="harvestRem" className="text-black">Harvest Reminders</label>
                        <input type="checkbox" id="harvestRem" name="harvestRem" className="w-4 h-4"/>
                    </div>

                    <div className="flex justify-between items-center mb-2 w-full">
                        <label htmlFor="marketUpdate" className="text-black">Market Updates</label>
                        <input type="checkbox" id="marketUpdate" name="marketUpdate" className="w-4 h-4"/>
                    </div>
                </div>

            </div>

            <div className="flex flex-col items-start justify-start mt-6 mb-4 rounded-lg shadow-md border border-gray-200 p-4">
                <h2 className="text-lg font-bold mb-4">About Your Farm</h2>
                <textarea
                    className="w-full bg-gray-100 border border-gray-200 rounded-md text-gray-600 text-sm mb-4 p-4 resize-none min-h-[240px] max-h-[240px] overflow-auto"
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    />

            </div>

            <div className="flex justify-end w-full mt-4">
                <button className="flex items-end justify-end bg-green-700 text-white font-bold px-4 py-1 rounded-md hover:bg-green-800 transition-colors"> Save Changes</button>      
            </div>
        </div>
    )
}

export default Settings;