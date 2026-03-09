import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Trash2 } from "lucide-react";
import api from "../../services/api";

type CropCategoryFilter = "all" | "General" | "Grain" | "Vegetable" | "Fruit" | "Other";

interface CropApi {
  crop_id: number;
  crop_name: string;
  category?: string | null;
  description?: string | null;
}

export default function ManageCrops() {
  const [crops, setCrops] = useState<CropApi[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CropCategoryFilter>("all");

  const fetchCrops = async () => {
    setLoading(true);
    try {
      
      const res = await api.get("/crops/");

      // if DRF returns array directly
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      setCrops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load crops:", err);
      setCrops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const filteredCrops = useMemo(() => {
    const q = search.trim().toLowerCase();

    return crops.filter((c) => {
      const name = (c.crop_name || "").toLowerCase();
      const cat = (c.category || "").toLowerCase();
      const desc = (c.description || "").toLowerCase();

      const matchesSearch = !q || name.includes(q) || cat.includes(q) || desc.includes(q);

      const matchesCategory =
        categoryFilter === "all" || cat === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [crops, search, categoryFilter]);

  const handleDelete = async (cropId: number) => {
    const ok = window.confirm("Delete this crop?");
    if (!ok) return;

    try {
      // ✅ correct delete endpoint: DELETE /api/v1/crops/<id>/
      await api.delete(`/crops/${cropId}/`);
      setCrops((prev) => prev.filter((c) => c.crop_id !== cropId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed. Check permissions / token.");
    }
  };

  return (
    <div className="space-y-6 pr-28">
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl lg:text-2xl font-bold">Crops Management</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search crops..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as CropCategoryFilter)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="all">All</option>
                <option value="General">General</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Grain">Grain</option>
                <option value="Fruit">Fruit</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading crops...</div>
        ) : filteredCrops.length === 0 ? (
          <div className="py-10 text-center text-gray-500">No crops found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
                  <th className="text-left py-3 px-4">CROP ID</th>
                  <th className="text-left py-3 px-4">CROP NAME</th>
                  <th className="text-left py-3 px-4">CATEGORY</th>
                  <th className="text-left py-3 px-4">DESCRIPTION</th>
                  <th className="text-left py-3 px-4">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredCrops.map((crop) => (
                  <tr
                    key={crop.crop_id}
                    className="border-b border-gray-100 hover:bg-gray-50 text-gray-600 text-sm"
                  >
                    <td className="py-3 px-4">{crop.crop_id}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{crop.crop_name}</td>
                    <td className="py-3 px-4">{crop.category || "—"}</td>
                    <td className="py-3 px-4">{crop.description || "—"}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(crop.crop_id)}
                        className="text-red-600 hover:bg-red-200 p-2 hover:text-red-800 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex gap-2">
              <button
                onClick={fetchCrops}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
