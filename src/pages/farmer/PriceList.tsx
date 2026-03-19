import { useEffect, useState } from "react";
import { GetPriceListPDF } from "../../api/pricelist";
import { CalendarClock, Download, ExternalLink, FileText, HardDrive, User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PriceListItem {
    id: number;
    filename: string;
    file_url: string;
    uploaded_by?: string | number | null;
    upload_date?: string;
    created_at?: string;
    file_size?: number | string | null;
}

const PriceList: React.FC = () => {

    const { t, i18n } = useTranslation();
    const isSinhala = i18n.language === "si";

    const [priceLists, setPriceLists] = useState<PriceListItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const docs = await GetPriceListPDF();
            setPriceLists(docs);
        };
        fetchData();
    }, []);

    const getDisplayFileName = (doc: PriceListItem): string => {
        if (doc.filename) return doc.filename;
        if (!doc.file_url) return "Document";
        const fromUrl = doc.file_url.split("/").pop() || "Document";
        return decodeURIComponent(fromUrl);
    };

    const getFileType = (filename: string): string => {
        const ext = filename.split(".").pop()?.toUpperCase();
        return ext || "FILE";
    };

    const formatDateTime = (dateValue?: string): string => {
        if (!dateValue) return "N/A";
        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) return "N/A";

        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatFileSize = (sizeValue?: number | string | null): string => {
        if (sizeValue === null || sizeValue === undefined || sizeValue === "") return "N/A";
        const bytes = typeof sizeValue === "string" ? Number(sizeValue) : sizeValue;
        if (!Number.isFinite(bytes) || bytes <= 0) return "N/A";

        const units = ["B", "KB", "MB", "GB"];
        let size = bytes as number;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex += 1;
        }

        return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
    };

    const handleDownload = (url: string, filename: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className={`p-8 ${isSinhala ? "font-sinhala" : "font-sans"}`}>
            <h1 className="text-4xl text-blue-900 font-bold p-4">{t("Daily Price Lists")}</h1>
            <p className="text-lg text-gray-500 mb-6">{t("Access and download the latest pricing documents for your reference")}</p>
            {priceLists.length > 0 ? (
                <ul>
                    {priceLists.map((doc) => {
                        const displayName = getDisplayFileName(doc);
                        const uploadedAt = doc.upload_date || doc.created_at;

                        return (
                            <li key={doc.id}>
                                <div className="border p-6 rounded-lg shadow-md flex flex-wrap items-center justify-between mb-4 bg-white">
                                    <div className="space-y-2">
                                        <strong className="text-lg text-gray-900">{displayName}</strong>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                            <p className="flex items-center gap-2">
                                                <User size={15} />
                                                {t("Uploaded by")}: {doc.uploaded_by || "Admin"}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <CalendarClock size={15} />
                                                {t("Uploaded on")}: {formatDateTime(uploadedAt)}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FileText size={15} />
                                                {t("Type")}: {getFileType(displayName)}
                                            </p>
                                            {/* <p className="flex items-center gap-2">
                                                <HardDrive size={15} />
                                                {t("Size")}: {formatFileSize(doc.file_size)}
                                            </p> */}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                                        <a
                                            href={doc.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-black text-white/90 px-8 sm:px-2 py-1 rounded-md hover:bg-white hover:text-black hover:border hover:border-black"
                                        >
                                            <div className="flex flex-wrap items-center gap-3 font-bold">
                                                <ExternalLink size={16} />
                                                {t("View")}
                                            </div>
                                        </a>
                                        <button
                                            onClick={() => handleDownload(doc.file_url, displayName)}
                                            className="bg-gray-100 px-4 py-2 rounded-md border hover:bg-gray-300"
                                            title={t("Download")}
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>{t("No documents found")}</p>
            )}

        </div>
    );
};

export default PriceList;