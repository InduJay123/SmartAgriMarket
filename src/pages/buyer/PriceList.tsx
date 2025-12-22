import { useEffect, useState } from "react";
import { GetPriceListPDF } from "../../api/pricelist";
import { Download, ExternalLink } from "lucide-react";

interface PriceListItem {
    id: number;
    filename: string;
    file_url: string;
    uploaded_by: string | number;
}

const PriceList:React.FC = () => {
    const [priceLists, setPriceLists] = useState<PriceListItem[]>([]);

    useEffect(() => {
    const fetchData = async () => {
        const docs = await GetPriceListPDF(); // docs is now always an array
        setPriceLists(docs);
    };
    fetchData();
}, []);


    return(
        <div className="p-8">
            <h1 className="text-4xl text-blue-900 font-bold p-4">Daily Price Lists</h1>
            <p className="text-lg text-gray-500 mb-6">Access and download the latest pricing documents for your reference</p>
            {priceLists.length > 0 ? (
                <ul >
                    {priceLists.map((doc) => (
                        <li key={doc.id} >
                            <div className ="border p-6 rounded-lg shadow-md flex flex-wrap items-center justify-between mb-4">
                                <div>
                                <strong>{doc.filename}</strong>
                                <p>Uploaded by: {doc.uploaded_by} </p>
                            </div>
                            
                           <div className=" flex flex-wrap gap-6">
                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                                    className="bg-black text-white/90 px-8 py-1 rounded-md hover:bg-white hover:text-black hover:border hover:border-black"
                                >
                                    <div className="flex flex-wrap items-center gap-3 font-bold">
                                        <ExternalLink size={16}/> 
                                        View 
                                    </div>
                                </a>
                                <button className="bg-gray-100 px-2 py-1 hover:bg-gray-300"> <Download/></button>
                           </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No documents found.</p>
            )}

        </div>
    )
}

export default PriceList;