import { Upload, FileText } from 'lucide-react';

export default function UploadPrice() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">
        <h2 className="text-xl lg:text-2xl font-bold mb-6">Upload Price Data</h2>

        <div className="max-w-2xl mx-auto">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 lg:p-12 text-center hover:border-emerald-500 transition-colors">
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
            <p className="text-gray-500 mb-4">Supports CSV, Excel files (max 10MB)</p>
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Select Files
            </button>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">Recent Uploads</h3>
            <div className="space-y-3">
              {[
                { name: 'tomato_prices_nov_2025.csv', date: '2025-11-09', status: 'Processed' },
                { name: 'onion_market_data.xlsx', date: '2025-11-08', status: 'Processed' },
                { name: 'rice_wholesale_prices.csv', date: '2025-11-07', status: 'Processing' },
              ].map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="text-emerald-600" size={24} />
                    <div>
                      <p className="font-medium text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-500">{file.date}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      file.status === 'Processed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {file.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
