import { useEffect, useState } from "react";
import { GetPriceListPDF } from "../../api/pricelist";
import { Download, ExternalLink, User } from "lucide-react";

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
    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return(
        <div className="p-8">
            <h1 className="text-4xl text-blue-900 font-bold p-4">Daily Price Lists</h1>
            <p className="text-md text-gray-500 mb-6">Access and download the latest pricing documents for your reference</p>
            {priceLists.length > 0 ? (
                <ul >
                    {priceLists.map((doc) => (
                        <li key={doc.id} >
                            <div className ="border bg-white px-6 py-4 rounded-lg shadow-sm flex flex-wrap items-center justify-between mb-4">
                                <div>
                                    <strong className="font-semibold text-lg">{doc.filename}</strong>
                                    <div className="flex gap-2 text-gray-500 mt-2 text-sm">
                                        <User size={18}/>
                                        <p>Uploaded by: {doc.uploaded_by || "Admin"}  </p>
                                    </div>
                                </div>
                            
                                <div className=" flex flex-wrap gap-6">
                                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                                        className="bg-black/90 text-white/90 px-8 sm:px-4 py-2 rounded-xl hover:bg-white hover:text-black hover:border hover:border-black"
                                    >
                                        <div className="flex flex-wrap items-center gap-2 font-semibold">
                                            <ExternalLink size={16}/> 
                                            View 
                                        </div>
                                    </a>
                                    <button
                                        onClick={() => handleDownload(doc.file_url, doc.filename)}
                                        className="bg-gray-100 px-2 py-1 border hover:bg-gray-300 rounded-xl"
                                        title="Download"
                                        >
                                        <Download />
                                    </button>
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