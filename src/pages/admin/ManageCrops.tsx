import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Eye } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import api from "../../services/api";

type CropCategoryFilter = "all" | "General" | "Grain" | "Vegetable" | "Fruit" | "Other";

interface CropApi {
  crop_id: number;
  crop_name: string;
  category?: string | null;
  description?: string | null;
}

interface CropMarketplaceListing {
  market_id?: number;
  farmer_id?: number;
  crop_id?: number;
  crop?: { crop_id?: number } | number | null;
  price?: number | string | null;
  unit?: string | null;
  quantity?: number | string | null;
  predicted_date?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  farming_method?: string | null;
  farming_season?: string | null;
  additional_details?: string | null;
  region?: string | null;
  district?: string | null;
  image?: string | null;
}

function cleanText(value?: string | null) {
  if (!value) return "—";
  const normalized = value.trim();
  if (!normalized) return "—";
  const lower = normalized.toLowerCase();
  return lower === "null" || lower === "undefined" ? "—" : normalized;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? cleanText(value) : d.toLocaleDateString();
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? cleanText(value) : d.toLocaleString();
}

function extractCropId(listing: CropMarketplaceListing) {
  if (typeof listing.crop_id === "number") return listing.crop_id;
  if (typeof listing.crop === "number") return listing.crop;
  if (listing.crop && typeof listing.crop === "object" && typeof listing.crop.crop_id === "number") {
    return listing.crop.crop_id;
  }
  return null;
}

export default function ManageCrops() {
  const [crops, setCrops] = useState<CropApi[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CropCategoryFilter>("all");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<CropApi | null>(null);
  const [relatedListings, setRelatedListings] = useState<CropMarketplaceListing[]>([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

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

  const openViewModal = async (crop: CropApi) => {
    setSelectedCrop(crop);
    setRelatedListings([]);
    setViewError("");
    setViewOpen(true);
    setViewLoading(true);
    try {
      const res = await api.get("/marketplace/marketplace/");
      const data = Array.isArray(res.data) ? res.data : res.data?.results ?? [];
      const listings = (Array.isArray(data) ? data : []) as CropMarketplaceListing[];

      setRelatedListings(listings.filter((listing) => extractCropId(listing) === crop.crop_id));
    } catch (err) {
      console.error("Failed to load crop listings:", err);
      setViewError("Failed to load related crop listings.");
    } finally {
      setViewLoading(false);
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
                        onClick={() => openViewModal(crop)}
                        className="text-emerald-600 hover:bg-emerald-200 p-2 hover:text-emerald-800 rounded"
                        title="View details"
                      >
                        <Eye size={16} />
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

      <Dialog.Root open={viewOpen} onOpenChange={setViewOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[96vw] max-w-6xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4 gap-3">
              <div>
                <Dialog.Title className="text-xl font-bold">Crop Listings View</Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500">
                  {selectedCrop
                    ? `${selectedCrop.crop_name} (ID: ${selectedCrop.crop_id})`
                    : "Related crop listing details"}
                </Dialog.Description>
              </div>
              <Dialog.Close className="p-2 rounded-lg hover:bg-gray-100">✕</Dialog.Close>
            </div>

            {viewLoading ? (
              <p className="text-gray-500">Loading related listings...</p>
            ) : viewError ? (
              <p className="text-red-600">{viewError}</p>
            ) : relatedListings.length === 0 ? (
              <p className="text-gray-500">No related listings found for this crop.</p>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full min-w-[1400px] text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-gray-700">
                      <th className="text-left py-3 px-3">Market ID</th>
                      <th className="text-left py-3 px-3">Farmer ID</th>
                      <th className="text-left py-3 px-3">Crop ID</th>
                      <th className="text-left py-3 px-3">Price</th>
                      <th className="text-left py-3 px-3">Unit</th>
                      <th className="text-left py-3 px-3">Quantity</th>
                      <th className="text-left py-3 px-3">Predicted Date</th>
                      <th className="text-left py-3 px-3">Status</th>
                      <th className="text-left py-3 px-3">Method</th>
                      <th className="text-left py-3 px-3">Season</th>
                      <th className="text-left py-3 px-3">Region</th>
                      <th className="text-left py-3 px-3">District</th>
                      <th className="text-left py-3 px-3">Details</th>
                      <th className="text-left py-3 px-3">Created At</th>
                      <th className="text-left py-3 px-3">Updated At</th>
                      <th className="text-left py-3 px-3">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedListings.map((listing, index) => (
                      <tr
                        key={`${listing.market_id ?? "row"}-${index}`}
                        className="border-b border-gray-100 text-gray-700 align-top"
                      >
                        <td className="py-3 px-3">{listing.market_id ?? "—"}</td>
                        <td className="py-3 px-3">{listing.farmer_id ?? "—"}</td>
                        <td className="py-3 px-3">{extractCropId(listing) ?? "—"}</td>
                        <td className="py-3 px-3">{listing.price ?? "—"}</td>
                        <td className="py-3 px-3">{cleanText(listing.unit)}</td>
                        <td className="py-3 px-3">{listing.quantity ?? "—"}</td>
                        <td className="py-3 px-3">{formatDate(listing.predicted_date)}</td>
                        <td className="py-3 px-3">{cleanText(listing.status)}</td>
                        <td className="py-3 px-3">{cleanText(listing.farming_method)}</td>
                        <td className="py-3 px-3">{cleanText(listing.farming_season)}</td>
                        <td className="py-3 px-3">{cleanText(listing.region)}</td>
                        <td className="py-3 px-3">{cleanText(listing.district)}</td>
                        <td className="py-3 px-3 max-w-[240px] break-words">{cleanText(listing.additional_details)}</td>
                        <td className="py-3 px-3">{formatDateTime(listing.created_at)}</td>
                        <td className="py-3 px-3">{formatDateTime(listing.updated_at)}</td>
                        <td className="py-3 px-3">
                          {cleanText(listing.image) === "—" ? (
                            "—"
                          ) : (
                            <a
                              href={listing.image || "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:text-emerald-900 underline"
                            >
                              Open
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <Dialog.Close className="px-4 py-2 rounded-lg border hover:bg-gray-50">Close</Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
