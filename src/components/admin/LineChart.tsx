interface DataPoint {
  month: string;
  price: number;
}

interface LineChartProps {
  data: DataPoint[];
  title: string;
}

export default function LineChart({ data, title }: LineChartProps) {
  const maxPrice = Math.max(...data.map(d => d.price));
  const minPrice = Math.min(...data.map(d => d.price));
  const range = maxPrice - minPrice;

  const getY = (price: number) => {
    return 100 - ((price - minPrice) / range) * 80;
  };

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = getY(point.price);
    return { x, y, ...point };
  });

  const pathD = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6">
      <h3 className="text-lg lg:text-xl font-semibold mb-4">{title}</h3>
      <div className="relative" style={{ height: '250px' }}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <path
            d={areaD}
            fill="url(#areaGradient)"
          />

          <path
            d={pathD}
            fill="none"
            stroke="#10b981"
            strokeWidth="0.5"
          />

          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="1"
              fill="#059669"
            />
          ))}
        </svg>

        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600 mt-2">
          {data.map((point, index) => (
            <span key={index}>{point.month}</span>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-6 text-sm text-gray-500">
        <span>Price Range: Rs: {minPrice} - Rs: {maxPrice}</span>
      </div>
    </div>
  );
}
