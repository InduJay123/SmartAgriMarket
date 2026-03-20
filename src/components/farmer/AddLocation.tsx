import { useState } from "react";
import { MapPin, Upload, UploadIcon, Info } from "lucide-react";
import type { CropFormData } from "../../@types/CropFormData";
import { supabase } from "../../lib/supabase";
import { useTranslation } from "react-i18next";


interface LocationProps {
  formData: CropFormData;
  setFormData: React.Dispatch<React.SetStateAction<CropFormData>>;
}

const AddLocation: React.FC<LocationProps> = ({ formData, setFormData }) => {

  const { t, i18n } = useTranslation();
  const isSinhala = i18n.language === "si";
  

  const [imagePreview, setImagePreview] = useState<string | null>(formData.image ? formData.image.toString() : null);
  const [uploading, setUploading] = useState(false);

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

  const selectedRegion = regions.find(r => r.value === formData.region);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `marketplace/${fileName}`;

    const { data, error } = await supabase.storage
      .from("marketplace")
      .upload(filePath, file);

    if (error) {
      console.error("Supabase upload error:", error.message);
      alert(`${t("Failed to upload image:")} ${error.message}`);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("marketplace")
      .getPublicUrl(filePath);

    setImagePreview(publicUrlData.publicUrl);
    setFormData({ ...formData, image: publicUrlData.publicUrl });
    setUploading(false);
  };

  return (
    <div className={`py-2 px-4 ${isSinhala ? "font-sinhala" : "font-sans"}`}>
      <h3 className="text-2xl font-bold mt-2 mb-2">{t("Location & Photo")}</h3>
      <form className="p-4 text-sm font-semibold">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <label>{t("Province")}</label>
            <select
              value={formData.region ?? ""}
              onChange={(e) => setFormData({ ...formData, region: e.target.value, district: "" })}
              className="w-full border px-4 py-1 rounded-xl"
            >
              <option value="" disabled>{t("Select province...")}</option>
              {regions.map(region => <option key={region.value} value={region.value}>{t(region.label)}</option>)}
            </select>
          </div>

          <div>
            <label>{t("District")}</label>
            <select
              value={formData.district ?? ""}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              className="w-full border px-4 py-1 rounded-xl"
              disabled={!formData.region}
            >
              <option value="" disabled>{t("Select district...")}</option>
              {selectedRegion?.districts.map(d => <option key={d} value={d.toLowerCase()}>{t(d)}</option>)}
            </select>
          </div>
        </div>

        
        <div className="relative mt-6">
                    <input id="crop-image" type="file" accept="image/*" 
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"/>
                    <label htmlFor="crop-image" className={`flex border-2 border-dashed rounded-xl hover:bg-green-50 hover:border-green-800 ${imagePreview ? "border bg-green-50" : "border"}`}>
                        {uploading ? (
                            <div className="w-full flex-col h-64 flex items-center justify-center p-4">
                                <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mb-2"></span>
                                <p className="text-gray-600 font-semibold">{t("Uploading image...")}</p>
                            </div>
                        ) : imagePreview ? (
                            <div className="w-full h-64 flex flex-col items-center justify-center overflow-hidden relative">
                                <img src={imagePreview} alt="Preview"
                                className="object-contain w-full h-full"/>
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 hover:opacity-100 transition-opacity">
                                    <p className="text-white text-sm"> {t("Click to change photo")} </p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-gray-700 gap-2">
                                <UploadIcon/>
                                <p> {t("Click to upload crop photo")} </p>
                                <p className="text-gray-600 text-xs font-normal"> {t("PNG, JPG up to 10MB")} </p>
                            </div>
                        )}
                    </label>
                </div>

        <p className="text-xs text-gray-500 mt-2"><Info size={12}/> {t("High-quality photos attract more buyers!")}</p>
      </form>
    </div>
  )
};

export default AddLocation;
