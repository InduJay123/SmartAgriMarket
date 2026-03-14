import { useEffect, useState } from "react";
import { GetPriceListPDF } from "../../api/pricelist";
import { Download, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PriceListItem {
    id: number;
    filename: string;
    file_url: string;
    uploaded_by: string | number;
}

const PriceList:React.FC = () => {

    const { t, i18n } = useTranslation();
    const isSinhala = i18n.language === "si";
    


    const [priceLists, setPriceLists] = useState<PriceListItem[]>([]);

    useEffect(() => {
    const fetchData = async () => {
        const docs = await GetPriceListPDF(); // docs is now always an array
        setPriceLists(docs);
    };
    fetchData();
}, []);

    return(
        <div className={`p-8 ${isSinhala ? "font-sinhala" : "font-sans"}`}>
            <h1 className="text-4xl text-blue-900 font-bold p-4">{t("Daily Price Lists")}</h1>
            <p className="text-lg text-gray-500 mb-6">{t("Access and download the latest pricing documents for your reference")}</p>
            {priceLists.length > 0 ? (
                <ul >
                    {priceLists.map((doc) => (
                        <li key={doc.id} >
                            <div className ="border p-6 rounded-lg shadow-md flex flex-wrap items-center justify-between mb-4">
                                <div>
                                <strong>{doc.filename}</strong>
                                <p>{t("Uploaded by")}: {doc.uploaded_by}</p>
                            </div>
                            
                           <div className=" flex flex-wrap gap-6">
                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                                    className="bg-black text-white/90 px-8 sm:px-2 py-1 rounded-md hover:bg-white hover:text-black hover:border hover:border-black"
                                >
                                    <div className="flex flex-wrap items-center gap-3 font-bold">
                                        <ExternalLink size={16}/> 
                                       {t("View")}
                                    </div>
                                </a>
                                <button className="bg-gray-100 px-2 py-1 hover:bg-gray-300"> <Download/></button>
                           </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>{t("No documents found")}</p>
            )}

        </div>
    )
}

export default PriceList;