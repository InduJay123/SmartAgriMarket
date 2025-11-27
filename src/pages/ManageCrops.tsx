import { Search, Plus } from 'lucide-react';

const crops = [
  { id: 1, name: 'Cowpea', category: 'Grain', season: 'Yala', avgPrice: 'Rs: 500/quintal' },
  { id: 2, name: 'Tomato', category: 'Vegetable', season: 'All season', avgPrice: 'Rs: 90/kg' },
  { id: 3, name: 'Onion', category: 'Vegetable', season: 'Maha', avgPrice: 'Rs: 1100/kg' },
  { id: 4, name: 'Wheat', category: 'Grain', season: 'Yala', avgPrice: 'Rs: 700/quintal' },
  { id: 5, name: 'Pumpkin', category: 'Vegetable', season: 'All season', avgPrice: 'Rs: 1,000/quintal' },
];

export default function ManageCrops() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl lg:text-2xl font-bold">Crops Management</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search crops..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Plus size={18} />
              Add Crop
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Crop Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Season</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">#{crop.id}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{crop.name}</td>
                  <td className="py-3 px-4 text-gray-600">{crop.category}</td>
                  <td className="py-3 px-4 text-gray-600">{crop.season}</td>
                  <td className="py-3 px-4 text-gray-600">{crop.avgPrice}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button className="text-emerald-600 hover:text-emerald-800 font-medium text-sm">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
