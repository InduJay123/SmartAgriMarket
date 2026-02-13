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
import { postFormData } from "../../api/farmer/farmer";
import { useTranslation } from "react-i18next";

const AddCrops: React.FC = () => {

  const { t, i18n } = useTranslation();
  const isSinhala = i18n.language === "si";

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CropFormData>({} as CropFormData);

  const validateStep = () => {
    switch(step){
      case 1: return Boolean((formData.crop && formData.crop.length > 0) || (formData.customCrop && formData.customCrop.length > 0));
      case 2: return formData.quantity && formData.predictDate && formData.farmingMethod;
      case 3: return formData.pricePerKg;
      case 4: return formData.region && formData.district;
      default: return true;
    }
  };

  const handleNext = () => { if(validateStep()) setStep(step+1); else alert(t("Please fill all required fields!")); };
  const handleBack = () => setStep(step-1);

  const handleSubmit = async () => {
    if(!validateStep()){ alert(t("Please fill all required fields!")); return; }

    try {
      // Crop creation
      const cropData = new FormData();
      const cropName = (formData.crop?.trim() || formData.customCrop?.trim() || "").toString();
      cropData.append(t("crop_name"), cropName);
      cropData.append(t("description"), formData.additionalDetails || "");
      if (formData.cropImage) cropData.append(t("image"), formData.cropImage);
      cropData.append(t("category"), "General");

      const cropResponse = await postFormData("/marketplace/crops/", cropData, { headers: { "Content-Type": "multipart/form-data" } });
      
      const cropId = cropResponse.data.id || cropResponse.data.crop_id;
      if (!cropId) {
        console.error(t("Crop creation failed:", cropResponse.data));
        alert(t("Crop creation failed. Please try again."));
        return;
      }
      console.log("Using crop ID:", cropId);
      console.log("Crop created successfully:", cropResponse.data);
      // Marketplace creation
      const marketplaceData = new FormData();
      marketplaceData.append("crop", String(cropId));
      marketplaceData.append("price", String(formData.pricePerKg));
      marketplaceData.append("unit", formData.unit || "kg");
      marketplaceData.append("predicted_date", String(formData.predictDate));
      marketplaceData.append("quantity", String(formData.quantity));
      marketplaceData.append("farming_method", 
        formData.farmingMethod ? String(formData.farmingMethod) : "Unknown"
      );
      marketplaceData.append("farming_season", String(formData.farmingSeason));
      marketplaceData.append("additional_details", String(formData.additionalDetails));
      marketplaceData.append("region", String(formData.region));
      marketplaceData.append("district", String(formData.district));
      marketplaceData.append("status", "Available");
      if(formData.image) marketplaceData.append("image", formData.image.toString());
      
      await postFormData("/marketplace/marketplace/", marketplaceData, { headers: { "Content-Type": "multipart/form-data" } });

      alert(t("Success! Your crop has been added successfully!"));
      setTimeout(() => navigate("/farmer/dashboard/"), 1500);

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) console.error(error.response?.data);
      else console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 p-4 w-full">
      <div className="flex flex-col items-center justify-center">
        <div className="inline-flex bg-gray-200 w-16 h-16 items-center justify-center rounded-full">
          <Sprout size={32} className="text-green-600"/>
        </div>
        <h2 className="text-3xl font-extrabold mb-2">{t("Add Your Crop")}</h2>
        <p className="text-sm text-gray-500 mb-8">{t("Share your harvest with buyers across Sri Lanka")}</p>
      </div>

      <ProgressBar step={step}/>

      <div className="bg-white p-4 rounded-xl border shadow-md">
        {step === 1 && <ChooseCrop formData={formData} setFormData={setFormData}/>}
        {step === 2 && <Details formData={formData} setFormData={setFormData}/>}
        {step === 3 && <Pricing formData={formData} setFormData={setFormData}/>}
        {step === 4 && <AddLocation formData={formData} setFormData={setFormData}/>}

        <hr/>
        <div className="flex flex-wrap justify-between mt-4">
          <button onClick={handleBack} className="flex items-center justify-center border bg-gray-50 rounded-md text-gray-700 py-1 px-4 hover:bg-red-800 hover:text-white gap-2">
            <ArrowLeft size={18}/> {t("Back")}
          </button>

          {step < 4 ? (
            <button onClick={handleNext} className="flex items-center justify-center border rounded-md bg-green-800 text-white py-1 px-4 hover:bg-green-700 gap-2">
              <ArrowRight size={18}/> {t("Continue")}
            </button>
          ) : (
            <button onClick={handleSubmit} className="flex items-center justify-center border rounded-md bg-green-800 text-white py-1 px-4 hover:bg-green-700 gap-2">
              <CheckCircle size={18}/> {t("Add Crop")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCrops;
