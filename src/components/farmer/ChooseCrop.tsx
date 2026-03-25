import emoji from "emoji-dictionary";
import { Info } from "lucide-react";
import type { CropFormData } from "../../@types/CropFormData";
import { useTranslation } from "react-i18next";

interface ChooseCropProps {
  formData: CropFormData
  setFormData: React.Dispatch<React.SetStateAction<CropFormData>>;
}

const ChooseCrop:React.FC<ChooseCropProps> = ({ formData,setFormData }) => {

     const { t, i18n } = useTranslation();
     const isSinhala = i18n.language === "si";


    const crops = [
        {name: "Tomato", nameSinhala: "තක්කාලි", image: emoji.getUnicode("tomato") },
        {name: "Carrot", nameSinhala: "කැරට්", image: emoji.getUnicode("carrot") },
        {name: "Cabbage", nameSinhala: "ගෝවා", image: "🥬" },
        {name: "Beans", nameSinhala: "බෝංචි", image: "🫘" },
        {name: "Potato", nameSinhala: "අල", image: emoji.getUnicode("potato") },
        {name: "Onion", nameSinhala: "ලූණු", image: "🧅" },
        {name: "Chili", nameSinhala: "මිරිස්", image: "🌶️" },
        {name: "Brinjal", nameSinhala: "වම්බටු", image: "🍆"},
        {name: "Pumpkin", nameSinhala: "වට්ටක්කා", image: "🎃"  },
        {name: "Corn", nameSinhala: "බඩඉරිඟු", image: emoji.getUnicode("corn")  },
        {name: "Banana", nameSinhala: "කෙසෙල්", image: emoji.getUnicode("banana")  },
        {name: "Papaya", nameSinhala: "ගස්ලබු", image: "🥭"  },
        
    ];

    const handleCustomChange = (value: string) => {
        const matchedCrop = crops.find(
        (crop) => crop.name.toLowerCase() === value.trim().toLowerCase()
        );

        if (matchedCrop) {
        setFormData({ ...formData, crop: matchedCrop.name, customCrop: "" });
        } else {
        setFormData({ ...formData, customCrop: value, crop: "" });
        }
  };

    return(
        <div className={`py-2 px-4 ${isSinhala ? "font-sinhala" : "font-sans"}`}>
           <h3 className="text-2xl font-bold mb-2">{t("What are you growing? 🌱")}</h3>
            <p className="text-sm text-gray-500 mb-4">{t("Select your crop from the options below")}</p>

            <div className=" grid grid-cols-2 sm:grid-cols-4 lg:grid-col-4 gap-4">
                {crops.map((crop) => (
                    <button key={crop.name} 
                    onClick={() => setFormData({...formData, crop: crop.name})}
                    className={`border rounded-md py-2 px-2 mb-2  transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    ${formData.crop === crop.name ? "border-green-800" : ""}`}>                            
                        <div className="text-3xl mb-2 sm:text-xl">{crop.image}</div>
                                                    <h3 className="font-bold sm:text-xs">{t(crop.name)}</h3>
                                                <h3 className="text-gray-700 mb-2 sm:text-xs">{crop.nameSinhala}</h3>
                    </button>
                ))}            
            </div>
               
            <div className="relative mt-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border"/>
                </div>
                <div className="relative flex justify-center text-xs">
                    <span className="px-2">{t("OR")}</span>
                </div>
            </div>
                
            <label htmlFor="customCrop" className="flex gap-2 mt-4 mb-2 items-center justify-start">
                <Info size={18}/>
                   <h3 className="font-semibold">{t("Enter a different crop name")}</h3>
            </label>

            <input id="customCrop" placeholder= {t("e.g., Lady's Finger, Beetroot...")} 
                value={formData.customCrop}
                onChange={(e) => handleCustomChange(e.target.value)} 
                className="px-3 py-1 mb-4 rounded-md border bg-gray-50 w-full text-sm"/>
                
        </div>
    )
}

export default ChooseCrop;