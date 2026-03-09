import React, { useState } from "react";
import { updateCrop } from "../../api/farmer/marketplace";
import ProductImageUpload from "./ProductImageUpload";
interface EditCropProps {
  crop: any;
  onClose: () => void;
}

const EditCrop: React.FC<EditCropProps> = ({ crop, onClose }) => {
  const [image, setImage] = useState<string | null>(crop.image || null);

  const [formData, setFormData] = useState({
    quantity: crop.quantity || "",
    price: crop.price || "",
    unit: crop.unit || "kg",
    predicted_date: crop.predicted_date || "",
    farming_season: crop.farming_season || "Unknown",
    status: crop.status || "Available",
    additional_details: crop.additional_details || ""
  });

  const getSeason = (dateStr: string) => {
    if (!dateStr) return "Unknown";
    const date = new Date(dateStr);
    const month = date.getMonth() + 1; // JS months are 0-indexed

    if (month >= 5 && month <= 8) {
        return "Yala";
    } else {
        return "Maha";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

      if (name === "predicted_date") {
          const season = getSeason(value);
          setFormData({ ...formData, predicted_date: value, farming_season: season });
      } else {
          setFormData({ ...formData, [name]: value });
      }};

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        farmer_id: crop.farmer_id,
        crop: crop.crop, // crop ID
        region: crop.region,
        district: crop.district,
        farming_method: crop.farming_method,
        image: image,
        additional_details: formData.additional_details || ""
      };
      
      await updateCrop(crop.market_id, payload);

      alert("Crop updated successfully!");
      onClose();
    } catch (error) {
      alert("Error updating crop. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Edit Crop Details</h2>
            <h2 className="text-sm text-gray-400 mb-6">Update your crop information and pricing</h2>
          </div>
          <button onClick={onClose} className="text-black border-none"> X </button>
        </div>

        <div className="mb-4 flex justify-center">
          <ProductImageUpload
            marketId={crop.market_id}
            image={image || undefined}
            onChange={(url) => setImage(url)}
          />
        </div>

        {/* Crop Name */}
        <div className="mb-2">
          <label className="block mb-1 font-semibold text-gray-800">Crop Name: {crop.crop_name}</label>
       </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Quantity */}
          <div className="mb-2">
            <label className="block mb-1 font-semibold text-gray-800">Quantity</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border p-2 rounded-xl text-sm" />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-semibold text-gray-800">Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className="w-full border p-2 rounded-xl text-sm">
              <option value="kg">kg</option>
              <option value="tons">tons</option>
              <option value="units">units</option>
            </select>
          </div>
        </div>
        {/* Price & Unit */}
        <div className="mb-2">
            <label className="block mb-1 font-semibold text-gray-800">Price per kg (Rs.)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded-xl text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
           {/* Predicted Date */}
          <div className="mb-2">
            <label className="block mb-1 font-semibold text-gray-800">Expected Harvest Date</label>
            <input type="date" name="predicted_date" value={formData.predicted_date} onChange={handleChange} className="w-full border p-2 rounded-xl text-sm" />
          </div>
          {/* Season */}
          <div className="mb-2">
            <label className="block mb-1 font-semibold text-gray-800">Season</label>
            <input
              type="text"
              name="farming_season"
              value={formData.farming_season}
              readOnly
              className="w-full border p-2 rounded-xl text-sm bg-gray-100"
            />
          </div>
        </div>

        {/* Status */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-800">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded-xl text-sm">
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-800">Additional Details</label>
          <input name="additional_details" onChange={handleChange} type="text" value={formData.additional_details}
            className="w-full border p-2 rounded-xl text-sm" />
        </div>


        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={onClose} className="w-1/2 bg-gray-100 border border-gray-300 p-1 rounded-xl">Cancel</button>
          <button onClick={handleSave} className="w-1/2 bg-green-900 text-white p-1 rounded-xl">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditCrop;  