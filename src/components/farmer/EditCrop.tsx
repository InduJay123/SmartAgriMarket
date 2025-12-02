import React, { useState} from "react";
import axios from "axios";

interface EditCropProps {
  crop: any;
  onClose: () => void;
}

const EditCrop: React.FC<EditCropProps> = ({ crop, onClose }) => {
  const [formData, setFormData] = useState({
    quantity: crop.quantity || "",
    price: crop.price || "",
    unit: crop.unit || "kg",
    predicted_date: crop.predicted_date || "",
    status: crop.status || "Available",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        farmer_id: crop.farmer_id,
        crop: crop.crop, // send crop id
        region: crop.region,
        district: crop.district,
        farming_method: crop.farming_method,
        image: crop.image,
      };

      await axios.put(`http://127.0.0.1:8000/api/marketplace/${crop.market_id}/`, payload);

      alert("Crop updated successfully!");
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating crop");
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

      <div className="mb-2">
        <label className="block mb-1 font-semibold text-gray-800">Crop Name</label>
        <input
          type="text"
          value={crop.crop_name}
          readOnly
          className="w-full border p-2 rounded-xl text-sm"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-semibold text-gray-800">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border p-2 rounded-xl text-sm"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-semibold text-gray-800">Price per kg (Rs.)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded-xl text-sm"
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-semibold text-gray-800">Unit</label>
        <select name="unit" value={formData.unit} onChange={handleChange} className="w-full border p-2 rounded-xl text-sm">
          <option value="kg">kg</option>
          <option value="tons">tons</option>
          <option value="units">units</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-semibold text-gray-800">Expected Harvest Date</label>
        <input
          type="date"
          name="predicted_date"
          value={formData.predicted_date}
          onChange={handleChange}
          className="w-full border p-2 rounded-xl text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold text-gray-800">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded-xl text-sm">
          <option value="Available">Available</option>
          <option value="Pending">Pending</option>
          <option value="Sold">Sold</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={onClose} className="w-1/2 bg-gray-100 border border-gray-300 p-1 rounded-xl">
          Cancel
        </button>
        <button onClick={handleSave} className="w-1/2 bg-green-900 text-white p-1 rounded-xl">
          Save Changes
        </button>
      </div>
    </div>
    </div>
  );
};

export default EditCrop;
