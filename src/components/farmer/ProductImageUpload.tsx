import { useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import placeholder from "../../assets/avatar.avif";
import { supabase } from "../../lib/supabase";
import { updateCrop } from "../../api/farmer/marketplace";

const BUCKET = "marketplace";

interface ProductImageUploadProps {
  marketId: number;
  image?: string;
  onChange: (url: string | null) => void;
}

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  marketId,
  image,
  onChange,
}) => {
  const [preview, setPreview] = useState(image || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setUploading(true);
    setError("");

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);

      if (!data?.publicUrl) throw new Error("Public URL not found");

      setPreview(data.publicUrl);
      onChange(data.publicUrl);

      // PATCH update
      await updateCrop(marketId, {
        image: data.publicUrl,
      });
    } catch (err) {
      console.error(err);
      setError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      if (preview) {
        const path = preview.split(`/public/${BUCKET}/`)[1];
        if (path) {
          await supabase.storage.from(BUCKET).remove([path]);
        }
      }

      await updateCrop(marketId, { image: null });

      setPreview("");
      onChange(null);
    } catch (err) {
      console.error(err);
      setError("Failed to remove image");
    }
  };

  return (
    <div className="relative w-28 h-28 group">
      <img
        src={preview || placeholder}
        alt="Product"
        className="w-28 h-28 object-cover rounded-xl border"
      />

      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition">
        <label className="cursor-pointer text-white">
          {uploading ? "Uploading..." : <Camera size={20} />}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-white hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ProductImageUpload;