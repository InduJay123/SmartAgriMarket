import { Search, Filter } from 'lucide-react';

const buyers = [
  { id: 1, name: 'Good Market (Colombo)', type: 'Wholesaler', location: 'Colombo', verified: true },
  { id: 2, name: 'Kandy Municipal Central Market (Kandy)', type: 'Retailer', location: 'Kandy', verified: true },
  { id: 3, name: 'Bandarawela Wholesale Vegetable Market', type: 'Wholesaler', location: 'Bandarawela', verified: false },
  { id: 4, name: 'Manning Market (Colombo)', type: 'Retailer', location: 'Colombo', verified: true },
  { id: 5, name: 'Dedicated Economic Centres (DECs)', type: 'Retailer', location: 'Dambulla', verified: true },
];

export default function ManageBuyers() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl lg:text-2xl font-bold">Buyers Management</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search buyers..."
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
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer) => (
                <tr key={buyer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">#{buyer.id}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{buyer.name}</td>
                  <td className="py-3 px-4 text-gray-600">{buyer.type}</td>
                  <td className="py-3 px-4 text-gray-600">{buyer.location}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        buyer.verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {buyer.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-emerald-600 hover:text-emerald-800 font-medium text-sm">
                      View Details
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
