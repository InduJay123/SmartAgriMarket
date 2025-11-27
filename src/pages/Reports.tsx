import { Download, TrendingUp, Users, ShoppingCart } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-6">Reports & Analytics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <TrendingUp className="text-emerald-600 mb-3" size={32} />
            <h3 className="font-semibold text-lg mb-2">Price Trends Report</h3>
            <p className="text-gray-600 text-sm mb-4">Monthly price analysis for all crops</p>
            <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
              <Download size={16} />
              Download
            </button>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <Users className="text-blue-600 mb-3" size={32} />
            <h3 className="font-semibold text-lg mb-2">Farmers Activity</h3>
            <p className="text-gray-600 text-sm mb-4">User engagement and registration stats</p>
            <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
              <Download size={16} />
              Download
            </button>
          </div>

          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
            <ShoppingCart className="text-yellow-600 mb-3" size={32} />
            <h3 className="font-semibold text-lg mb-2">Market Transactions</h3>
            <p className="text-gray-600 text-sm mb-4">Buyer-seller transaction summary</p>
            <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
