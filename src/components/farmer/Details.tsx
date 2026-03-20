import emoji from "emoji-dictionary";
import { Calendar, Package, Shovel, Sprout } from "lucide-react";
import type { CropFormData } from "../../@types/CropFormData";
import { useTranslation } from "react-i18next";

interface DetailsProps {
  formData: CropFormData
  setFormData: React.Dispatch<React.SetStateAction<CropFormData>>;
}

const Details: React.FC<DetailsProps> = ({ formData, setFormData }) => {

    const { t, i18n } = useTranslation();
    const isSinhala = i18n.language === "si";
    
    const getSeason = (dateStr: string) => {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1; 

        if (month >= 5 && month <= 8) {
            return t("Yala");
        } else {
            return t("Maha");
        }
    };

    return(
        <div className={`py-2 px-4 ${isSinhala ? "font-sinhala" : "font-sans"}`}>
            <h1 className="text-5xl">{emoji.getUnicode("ear_of_rice")}</h1>
            <h3 className="text-2xl font-bold mt-2 mb-2">{t("Tell us about your harvest")} {emoji.getUnicode("package")}</h3>
            <p className="text-sm text-gray-500 mb-4">{t("Quantity and harvest details")}</p>

            <form className="p-4  text-sm font-semibold">
                <div className="grid lg:grid-cols-2 gap-6 ">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-start gap-2 mb-2 ">
                            <Package size={18} className="text-green-900"/>
                            <label htmlFor="quantity"> {t("Expected Quantity")} </label>
                        </div>
                        <div className="w-full flex flex-wrap gap-2">
                            <input id="quantity" type="number" placeholder="500" 
                                value={formData.quantity ?? ""}
                                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                className="bg-gray-50 border rounded-xl px-4 py-1"
                            />
                            <select 
                                value={ formData.unit ?? "kg" }
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="text-gray-700 bg-gray-50 border rounded-xl px-4 py-1">
                                <option value="kg"> {t("kg")} </option>
                                <option value="tons"> {t("tons")} </option>
                                <option value="units"> {t("units")} </option>               
                            </select>
                        </div>                        
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex flex-wrap items-center justify-start gap-2 mb-2 ">
                            <Calendar size={18} className="text-green-900"/> 
                            <label htmlFor="harvestDate" className="text-sm"> {t("Expected Harvest Date")} </label>    
                        </div>
                        <input id="harvestDate" type="date" placeholder="500"
                            value={formData.predictDate ?? ""}
                            onChange={(e) => {
                                const selectedDate = e.target.value;
                                const season = getSeason(selectedDate);

                                setFormData({ ...formData, 
                                    predictDate: e.target.value, 
                                    farmingSeason: season,
                                });
                            }}
                            className="bg-gray-50 text-gray-600 border rounded-xl px-4 py-1"
                        />
                    </div>
                    
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="flex flex-wrap items-center justify-start gap-2 mt-4 mb-2">
                            <Sprout size={18} className="text-green-900"/>
                            <label htmlFor="farmingMethod">  {t("Farming Method")} </label>   
                        </div>              
                        <select 
                            id="farmingMethod"
                            value={formData.farmingMethod ?? ""}
                            onChange={(e) => setFormData({ ...formData, farmingMethod: e.target.value })}
                            className="text-gray-700 w-full bg-gray-50 border rounded-xl px-4 py-1 mb-4">
                            <option value="" disabled> {t("Select farming method...")} </option>
                            <option value="organic"> {t("Organic Farming")} </option>
                            <option value="conventional"> {t("Conventional Farming")} </option>
                            <option value="hydroponic"> {t("Hydroponic")} </option>
                            <option value="greenHouse"> {t("Green House")} </option>
                        </select>
                    </div>
                    <div>            
                        <div className="flex flex-wrap items-center justify-start gap-2 mt-4 mb-2">
                            <Shovel size={18} className="text-green-900"/>
                            <label> {t("Season")} </label>
                        </div>
                        <input
                            type="text"
                            value={formData.farmingSeason ?? ""}
                            readOnly
                            className="text-gray-700 w-full bg-gray-50 border rounded-xl px-4 py-1 mb-4"
                        />
                    </div>
                </div>
                
                <div className="flex flex-col items-start justify-start mt-2">
                    <label htmlFor="details"> {t("Additional Details (Optional)")} </label>
                    <input id="details" type="text" placeholder={t("Tell buyers about quality, certifications,special features...")} 
                        value={formData.additionalDetails ?? ""}
                        onChange={(e) => setFormData({ ...formData, additionalDetails: String(e.target.value) })}
                        className="w-full bg-gray-50 border rounded-lg px-2 pt-2 pb-12 mt-2" 
                    />
                </div>
                                
            </form>
        </div>
    )
}

export default Details;