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
    <div className="p-6 bg-white rounded shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Edit Crop</h2>

      <div className="mb-4">
        <label className="block mb-1">Crop Name</label>
        <input
          type="text"
          value={crop.crop_name}
          readOnly
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Unit</label>
        <select name="unit" value={formData.unit} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="kg">kg</option>
          <option value="tons">tons</option>
          <option value="units">units</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Expected Harvest Date</label>
        <input
          type="date"
          name="predicted_date"
          value={formData.predicted_date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="Available">Available</option>
          <option value="Pending">Pending</option>
          <option value="Sold">Sold</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button onClick={onClose} className="w-1/2 bg-gray-300 p-2 rounded">
          Cancel
        </button>
        <button onClick={handleSave} className="w-1/2 bg-green-600 text-white p-2 rounded">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditCrop;
