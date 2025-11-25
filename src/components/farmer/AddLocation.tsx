import emoji from "emoji-dictionary";
import { Info, MapPin, Upload, UploadIcon } from "lucide-react";
import { useState } from "react";
import type { CropFormData } from "../../@types/CropFormData";

interface LocationProps{
  formData: CropFormData
  setFormData: React.Dispatch<React.SetStateAction<CropFormData>>;
}


const AddLocation:React.FC<LocationProps> = ({ formData,setFormData }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);


    const regions = [
        { value: "western", label: "Western Province", districts: ["Colombo", "Gampaha", "Kalutara"] },
        { value: "central", label: "Central Province", districts: ["Kandy", "Matale", "Nuwara Eliya"] },
        { value: "southern", label: "Southern Province", districts: ["Galle", "Matara", "Hambantota"] },
        { value: "northern", label: "Northern Province", districts: ["Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu"] },
        { value: "eastern", label: "Eastern Province", districts: ["Trincomalee", "Batticaloa", "Ampara"] },
        { value: "north-western", label: "North Western Province", districts: ["Kurunegala", "Puttalam"] },
        { value: "north-central", label: "North Central Province", districts: ["Anuradhapura", "Polonnaruwa"] },
        { value: "uva", label: "Uva Province", districts: ["Badulla", "Monaragala"] },
        { value: "sabaragamuwa", label: "Sabaragamuwa Province", districts: ["Ratnapura", "Kegalle"] },
    ];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const selectedRegion = regions.find((r) => r.value === formData.region);

    return(
        <div>
            <h2 className="text-5xl"> {emoji.getUnicode("round_pushpin")}</h2>
            <h3 className="text-2xl font-bold mt-2 mb-2">Location & Photo</h3>
            <p className="text-sm text-gray-500 mb-4">Where is your farm located?</p>

            <form className="p-4  text-sm font-semibold">
                <div className="grid lg:grid-cols-2 gap-8 ">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-start gap-2 mb-2 ">
                            <MapPin size={18} className="text-green-900"/>
                            <label htmlFor="quantity"> Province  </label>
                        </div>
                        <div className="flex gap-2">
                            <select value={formData.region ?? ""} 
                            onChange = {(e) => 
                                setFormData({...formData, region: e.target.value, district: ""})
                            } 
                            className="w-full text-gray-700 bg-gray-50 border rounded-xl px-4 py-1">
                                <option value="" disabled> Select province... </option>
                                {regions.map((region) => (
                                    <option key={region.value} value={region.value}> 
                                        {region.label}
                                    </option>
                                ))}              
                            </select>
                        </div>                        
                    </div>

                    <div className="flex flex-col">
                        <div className="flex flex-wrap items-center justify-start gap-2 mb-2 ">
                            <MapPin size={18} className="text-green-900"/> 
                            <label htmlFor="harvestDate"> District </label>    
                        </div>
                        <div className="flex gap-2">
                            <select value={formData.district ?? ""} 
                                onChange={(e) => 
                                    setFormData({...formData,district: e.target.value, }  
                                )}
                                className="w-full text-gray-700 bg-gray-50 border rounded-xl px-4 py-1"
                                disabled={!formData.region}
                            >
                                <option value="" disabled> Select district... </option>
                                {selectedRegion?.districts.map((district) => (
                                    <option key={district} value={district.toLowerCase()}> 
                                        {district}
                                    </option>
                                ))}              
                            </select>
                        </div>  
                    </div>
                    
                </div>
                
                <div className="flex flex-wrap items-center justify-start gap-2 mt-4 mb-2">
                    <Upload size={18} className="text-green-900"/>
                    <label htmlFor="farmingMethod">  Upload Crop Photo </label>   
                </div>   

                <div className="relative">
                    <input id="crop-image" type="file" accept="image/*" 
                    onChange={handleImageUpload}
                    className="hidden"/>
                    <label htmlFor="crop-image" className={`flex border-2 border-dashed rounded-xl hover:bg-green-50 hover:border-green-800 ${imagePreview ? "border bg-green-50" : "border"}`}>
                        {imagePreview ? (
                            <div className="w-full h-64 flex flex-col items-center justify-center overflow-hidden relative">
                                <img src={imagePreview} alt="Preview"
                                className="object-contain w-full h-full"/>
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 hover:opacity-100 transition-opacity">
                                    <p className="text-white text-sm"> Click to change photo </p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-gray-700 gap-2">
                                <UploadIcon/>
                                <p> Click to upload crop photo</p>
                                <p className="text-gray-600 text-xs font-normal"> PNG, JPG up to 10MB </p>
                            </div>
                        )}
                    </label>
                </div>

                <p className="flex text-gray-700 font-normal text-xs items-center gap-2 mt-2">
                    <Info size={12}/> High-quality photos attract more buyers!</p>
            </form>   
        </div>
    )
}

export default AddLocation;