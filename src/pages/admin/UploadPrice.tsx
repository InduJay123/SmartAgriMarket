import { useEffect, useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import api from "../../api/api";
import { supabase } from "../../lib/supabase";

interface PriceUploadApi {
  id: number;
  filename: string;
  file_url: string;
  upload_date: string;
}
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ACCEPTED_EXT = [".csv", ".xls", ".xlsx", ".pdf"]; // allowed file extensions

const UPLOAD_URL = "/documents/price-list/upload/"; // POST
const LIST_URL = "/documents/price-lists/"; // GET

export default function UploadPrice() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploads, setUploads] = useState<PriceUploadApi[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [customFilename, setCustomFilename] = useState<string>("");

  const pickFile = () => fileInputRef.current?.click();

  const validateFile = (file: File) => {
    const lower = file.name.toLowerCase();
    const extOk = ACCEPTED_EXT.some((ext) => lower.endsWith(ext));
    if (!extOk) return `Invalid file type. Allowed: ${ACCEPTED_EXT.join(", ")}`;
    if (file.size > MAX_SIZE_BYTES) return "File too large. Max 10MB.";
    return "";
  };

 const fetchRecentUploads = async () => {
  setLoadingList(true);
  try {
    const res = await api.get(LIST_URL);
    setUploads(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error("Failed to load uploads:", err);
    setUploads([]);
  } finally {
    setLoadingList(false);
  }
};

  useEffect(() => {
    fetchRecentUploads();
  }, []);

  const uploadFile = async (file: File) => {
    const err = validateFile(file);
    if (err) {
      setErrorMsg(err);
      return;
    }

    if (!customFilename.trim()) {
      setErrorMsg('Please enter a Document Name before uploading.');
      return;
    }

    setErrorMsg("");
    setUploading(true);

    try {
      // 1. Upload to Supabase bucket
      const timestamp = new Date().getTime();
      const ext = file.name.substring(file.name.lastIndexOf('.')); const safeCustomName = customFilename.replace(/[^a-zA-Z0-9.-]/g, '_'); const uniqueFileName = `${timestamp}_${safeCustomName}${ext}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("price_list")
        .upload(uniqueFileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Supabase upload failed: ${uploadError.message}`);
      }

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from("price_list")
        .getPublicUrl(uploadData.path);

      if (!urlData.publicUrl) {
        throw new Error("Could not generate public URL");
      }

      // 3. Send filename and file_url to Django backend
      await api.post(UPLOAD_URL, {
        filename: `${customFilename}${ext}`,
        file_url: urlData.publicUrl,
      });

      // refresh list after upload
      await fetchRecentUploads();
      } catch (err: any) {
        console.error("Upload failed:", err);
        const msg =
          err?.response?.data?.detail ||
          err?.response?.data?.error ||
          err?.message ||
          "Upload failed. Check backend endpoint / permissions.";
        setErrorMsg(msg);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };


  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6 pr-28">
      <div className="bg-white rounded-lg shadow-lg p-2 lg:p-4">
        <h2 className="text-xl lg:text-2xl font-bold mb-6">Upload Price Data</h2>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side: Upload Section */}
          <div className="flex flex-col">
            {errorMsg && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Name (Required)
              </label>
              <input 
                type="text" 
                placeholder="e.g., Weekly Potato Prices" 
                value={customFilename} 
                onChange={(e) => setCustomFilename(e.target.value)} 
                className="w-full border-gray-300 rounded-lg shadow-sm p-2 border focus:ring-emerald-500 focus:border-emerald-500" 
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xls,.xlsx,.pdf"
              className="hidden"
              onChange={onFileChange}
            />

            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 lg:p-12 text-center hover:border-emerald-500 transition-colors"
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Drop files here or click to upload
              </h3>
              <p className="text-gray-500 mb-4">
                Supports CSV, Excel, PDF files (max 10MB)
              </p>

              <button
                type="button"
                onClick={pickFile}
                disabled={uploading}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
              >
                {uploading ? "Uploading..." : "Select Files"}
              </button>
            </div>
          </div>

          {/* Right Side: Recent Uploads */}
          <div className="flex flex-col">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Recent Uploads</h3>
                <button
                  onClick={fetchRecentUploads}
                  className="text-sm px-3 py-1 border border-gray-300 rounded-lg hover:bg-white bg-white shadow-sm"
                >
                  Refresh
                </button>
              </div>

              {loadingList ? (
                <div className="py-6 text-center text-gray-500">Loading...</div>
              ) : uploads.length === 0 ? (
                <div className="py-6 text-center text-gray-500">
                  No uploads found.
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2">
                  {uploads.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-4 border border-gray-200 bg-white rounded-lg hover:border-emerald-300 transition-colors shadow-sm"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <FileText className="text-emerald-600 flex-shrink-0" size={24} />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-800 truncate" title={u.filename}>
                            {u.filename}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(u.upload_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


