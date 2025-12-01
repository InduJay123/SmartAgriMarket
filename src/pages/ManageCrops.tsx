import { Search, Filter, Trash2 } from 'lucide-react';

const crops = [
  { id: 1, name: 'Cowpea', category: 'Grain', season: 'Yala', avgPrice: 'Rs: 500/quintal' },
  { id: 2, name: 'Tomato', category: 'Vegetable', season: 'All season', avgPrice: 'Rs: 90/kg' },
  { id: 3, name: 'Onion', category: 'Vegetable', season: 'Maha', avgPrice: 'Rs: 1100/kg' },
  { id: 4, name: 'Wheat', category: 'Grain', season: 'Yala', avgPrice: 'Rs: 700/quintal' },
  { id: 5, name: 'Pumpkin', category: 'Vegetable', season: 'All season', avgPrice: 'Rs: 1,000/quintal' },
];

export default function ManageCrops() {
  return (
    <div className="space-y-6 pr-28">
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
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 font-semibold text-gray-700">
                <th className="text-left py-3 px-4 ">ID</th>
                <th className="text-left py-3 px-4 ">Crop Name</th>
                <th className="text-left py-3 px-4 ">Category</th>
                <th className="text-left py-3 px-4 ">Season</th>
                <th className="text-left py-3 px-4 ">Avg Price</th>
                <th className="text-left py-3 px-4 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop.id} className="border-b border-gray-100 hover:bg-gray-50 text-gray-600 text-sm">
                  <td className="py-3 px-4 ">#{crop.id}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{crop.name}</td>
                  <td className="py-3 px-4 ">{crop.category}</td>
                  <td className="py-3 px-4">{crop.season}</td>
                  <td className="py-3 px-4">{crop.avgPrice}</td>
                  <td className="py-3 px-4 text-center">
                    
                    <button className="text-red-600 hover:bg-red-200 p-2 hover:text-red-800 border-none">
                      <Trash2 size={16}/>
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
