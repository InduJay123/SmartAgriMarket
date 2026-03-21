import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { getFarmerProfile } from "../../api/farmer/farmerProfile";
import { useTranslation } from "react-i18next";


interface HeaderProps {
    icon?: React.ElementType
    title?: string;
    subTitle?: string
}

const Header:React.FC <HeaderProps>= ({
    

    icon: IconComponent,
    title,
    subTitle,
}) => {

    const { t, i18n } = useTranslation();
    const isSinhala = i18n.language === "si";

    const [farmer, setFarmer] = useState<{ first_name: string  } | null>(null);
    useEffect(() => {
        const fetchFarmer = async () => {
          const data = await getFarmerProfile();
          setFarmer({
            first_name: data?.first_name,
          });
        };
        fetchFarmer();
      }, []);
    return(
        <div className={`py-2 px-4 ${isSinhala ? "font-sinhala" : "font-sans"}`}>
            <div className="flex flex-col items-start justify-start gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-6">
                    <User/>
                    <div className="flex flex-col items-start justify-start gap-2">
                        <h1 className="font-extrabold text-3xl"> {t("Welcome back, {name}", { name: farmer?.first_name })} </h1>                         
                        <p className="text-xs text-gray-400"> {t("Here's what's happening with your farm today")} </p>
                    </div>
                </div>                    
            </div>

            <div className="flex flex-wrap gap-4 items-start justify-start">
                {IconComponent && <IconComponent  className="text-gray-500"/>}
                <h2  className="text-black font-bold text-2xl">{title}</h2>
            </div>
            <p className="text-xs text-gray-400 text-start mt-2">{subTitle}</p>
        </div>
        
    )
}

export default Header;