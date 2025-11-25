import emoji from "emoji-dictionary";
import { Info } from "lucide-react";
import type { CropFormData } from "../../@types/CropFormData";

interface PricingProps {
  formData: CropFormData
  setFormData: React.Dispatch<React.SetStateAction<CropFormData>>;
}


const Pricing:React.FC<PricingProps> = ({ formData,setFormData }) => {
    return(
        <div className="p-4">
            <h2 className="text-5xl"> {emoji.getUnicode("moneybag")}</h2>
            <h3 className="text-2xl font-bold mt-2 mb-2">Set your price</h3>
            <p className="text-sm text-gray-500 mb-4">What's your expected price?</p>

            <p className="flex flex-wrap gap-2 bg-gray-50 border rounded-xl p-4 text-gray-600 text-sm mt-2 mb-6">
                <Info size={18} className="text-green-800"/> 
                <span className="font-semibold text-black"> Pricing Tip: </span> 
                Check current market prices in your region. Competitive pricing attracts more buyers!
            </p>

            <div className="flex flex-col items-start justify-start">
                <label htmlFor="pricePerKg" className="font-semibold mb-2"> {emoji.getUnicode("dollar")} Price per kg </label>
                <input id="pricePerkg" type="number" placeholder="RS. 250"
                    value={formData.pricePerKg ?? ""}
                    onChange={(e) => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
                    className="w-full bg-gray-50 border rounded-xl p-2"/>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 mt-6 mb-4">
                <div className="border rounded-xl p-3 hover:border-green-700">
                    <p className="text-gray-600 text-sm"> Market Average </p>
                    <p className="text-lg font-semibold">Rs. 230</p>
                </div>

                <div className="border  rounded-xl p-3 hover:border-green-700">
                    <p className="text-gray-600 text-sm"> Your Price </p>
                    <p className="text-lg  font-semibold text-green-800">Rs. {formData.pricePerKg} </p>
                </div>

                <div className="border rounded-xl p-3 hover:border-green-700">
                    <p className="text-gray-600 text-sm"> Premium Price </p>
                    <p className="text-lg  font-semibold">Rs. 280</p>
                </div>
                
            </div>
        </div>
    )
}

export default Pricing;