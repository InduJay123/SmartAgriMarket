interface DataPoint {
  crop: string;
  supply: number;
}

interface BarChartProps {
  data: DataPoint[];
  title: string;
}

export default function BarChart({ data, title }: BarChartProps) {
  const maxSupply = Math.max(...data.map(d => d.supply));

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
      <h3 className="text-lg lg:text-xl font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.supply / maxSupply) * 100;
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="font-medium text-gray-700">{item.crop}</span>
                <span className="text-gray-600">{item.supply}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-8">
                <div
                  className="bg-emerald-500 h-8 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                  style={{ width: `${percentage}%` }}
                >
                  <span className="text-white text-xs font-medium">
                    {percentage > 15 ? `${item.supply}` : ''}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
