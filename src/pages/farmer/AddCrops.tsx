import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Sprout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { CropFormData } from "../../@types/CropFormData";
import axios from "axios";
import ProgressBar from "../../components/farmer/ProgressBar";
import ChooseCrop from "../../components/farmer/ChooseCrop";
import Details from "../../components/farmer/Details";
import Pricing from "../../components/farmer/Pricing";
import AddLocation from "../../components/farmer/AddLocation";

const AddCrops: React.FC = () => {

    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<CropFormData>({});

    const validateStep = () => {
        switch(step){
            case 1:
                return Boolean(  
                    (formData.crop && formData.crop.length > 0) ||
                    (formData.customCrop && formData.customCrop.length > 0)
                );
            case 2:
                return formData.quantity && formData.predictDate && formData.farmingMethod;
            case 3:
                return formData.pricePerKg;
            case 4:
                return formData.region && formData.district;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if(!validateStep()){
            alert("Please fill all the required fields!");
            return;
        }
        setStep(step+1);
    };

    const handleBack = () => setStep(step-1);

    const handleSubmit = async () => {
        if(!validateStep()){
            alert("Please fill all required fields!");
            return;
        }

        try{

            const cropData = new FormData();

            const cropName = (formData.crop?.trim() || formData.customCrop?.trim() || "").toString();
            cropData.append("crop_name", cropName);
            console.log("Step 1 formData:", formData);


            cropData.append("description", formData.additionalDetails || "");
            if (formData.cropImage) {
                cropData.append("image", formData.cropImage);
            }
            cropData.append("category", "General");

            

            const cropResponse = await axios.post("http://127.0.0.1:8000/api/crops/", cropData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(cropResponse.data);

            const cropId = cropResponse.data.crop_id;

            if (!cropId) {
                alert("Crop creation failed, no ID returned");
                return;
            }

            const marketplaceData = new FormData();
            marketplaceData.append("crop", String(cropId));
            marketplaceData.append("price", String(formData.pricePerKg));
            marketplaceData.append("unit", formData.unit || "kg");
            marketplaceData.append("predicted_date", String(formData.predictDate));
            marketplaceData.append("quantity", String(formData.quantity));
            marketplaceData.append("farming_method", String(formData.farmingMethod));
            marketplaceData.append("region", String(formData.region));
            marketplaceData.append("district", String(formData.district));
            marketplaceData.append("status", "Available");

            marketplaceData.append("farmer_id", "1"); // or get from auth


            if(formData.image){
                marketplaceData.append("image", formData.image);
            }


            const marketResponse = await axios.post("http://127.0.0.1:8000/api/marketplace/", marketplaceData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

           console.log("Marketplace Response:", marketResponse.data);

            alert("Success! Your crop has been added successfully!");
            setTimeout(() => navigate("/farmer/addcrops"), 1500);
            
            
        }catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.log("ERROR RESPONSE:", error.response?.data);
            } else {
                console.log("Unknown error", error);
            }
       }
    }

    return(
        <div className="bg-gray-50 p-4 w-full">
            <div className="flex flex-col items-center justify-center">
                <div className="inline-flex bg-gray-200 w-16 h-16 items-center justify-center rounded-full"><Sprout size={32} className="text-green-600  items-center"/></div>
                <h2 className="text-3xl font-extrabold mb-2">Add Your Crop</h2>
                <p className="text-sm text-gray-500 mb-8">Share ypur harvest with buyers across Sri Lanka</p>
            </div>
            <ProgressBar step={step}/>
            
            <div className="bg-white p-4 rounded-xl border shadow-md">
                {step === 1 && (
                    <ChooseCrop formData={formData} setFormData={setFormData}/>
                )}

                {step === 2 && (
                    <Details formData={formData} setFormData={setFormData}/>
                )}

                {step === 3 && (
                    <Pricing formData={formData} setFormData={setFormData}/>
                )}

                {step === 4 && (
                    <AddLocation formData={formData} setFormData={setFormData}/>
                )}

                <hr/>

                <div className="flex flex-wrap justify-between mt-4">
                    <button onClick={handleBack} className="flex items-center justify-center border bg-gray-50 rounded-md text-gray-700 py-1 px-4 hover:bg-red-800 hover:text-white gap-2">
                        <ArrowLeft size={18}/> Back                       
                    </button>

                    {step < 4 ? (
                        <button onClick={handleNext} className="flex items-center justify-center border rounded-md bg-green-800 text-white py-1 px-4 hover:bg-green-700 gap-2">
                            <ArrowRight size={18}/> Continue                      
                        </button>
                    ):(
                        <button onClick={handleSubmit} className="flex items-center justify-center border rounded-md bg-green-800 text-white py-1 px-4 hover:bg-green-700 gap-2">
                            <CheckCircle size={18}/> Add Crop
                        </button>
                    )}            
                </div>
            </div>

            
        </div>
    )
}

export default AddCrops;