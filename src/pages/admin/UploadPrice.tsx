import { useEffect, useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import api from "../../services/api";

type UploadStatus = "PROCESSING" | "PROCESSED" | "FAILED";

interface PriceUploadApi {
  id: number;
  file_name: string;
  created_at: string; // ISO
  status: UploadStatus;
  error_message?: string | null;
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ACCEPTED_EXT = [".csv", ".xls", ".xlsx"];

// ✅ change these if your backend uses different routes
const UPLOAD_URL = "/prices/uploads/"; // POST
const LIST_URL = "/prices/uploads/"; // GET

export default function UploadPrice() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploads, setUploads] = useState<PriceUploadApi[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

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

    setErrorMsg("");
    setUploading(true);

    try {
      const form = new FormData();
      // backend should read request.FILES["file"]
      form.append("file", file);

      await api.post(UPLOAD_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // refresh list after upload
      await fetchRecentUploads();
    } catch (err: any) {
      console.error("Upload failed:", err);
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
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

  const badgeClass = (status: UploadStatus) => {
    if (status === "PROCESSED") return "bg-green-100 text-green-800";
    if (status === "FAILED") return "bg-red-100 text-red-800";
    return "bg-blue-100 text-blue-800";
  };

  const displayStatus = (status: UploadStatus) => {
    if (status === "PROCESSED") return "Processed";
    if (status === "FAILED") return "Failed";
    return "Processing";
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

        <div className="max-w-2xl mx-auto">
          {/* ✅ Error message */}
          {errorMsg && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          {/* ✅ Hidden input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            className="hidden"
            onChange={onFileChange}
          />

          {/* ✅ Drop zone */}
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
              Supports CSV, Excel files (max 10MB)
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

          {/* ✅ Recent uploads */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Uploads</h3>
              <button
                onClick={fetchRecentUploads}
                className="text-sm px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
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
              <div className="space-y-3">
                {uploads.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="text-emerald-600" size={24} />
                      <div>
                        <p className="font-medium text-gray-800">
                          {u.file_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(u.created_at)}
                        </p>
                        {u.status === "FAILED" && u.error_message ? (
                          <p className="text-xs text-red-600 mt-1">
                            {u.error_message}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass(
                        u.status
                      )}`}
                    >
                      {displayStatus(u.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
