import { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

interface PriceRangeFilterProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  maxPrice: number;
}

function PriceRangeFilter({ priceRange, setPriceRange, maxPrice }: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(priceRange[0]);
  const [localMax, setLocalMax] = useState(priceRange[1]);

  useEffect(() => {
    setLocalMin(priceRange[0]);
    setLocalMax(priceRange[1]);
  }, [priceRange]);

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, localMax - 0.5);
    setLocalMin(newMin);
    setPriceRange([newMin, localMax]);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, localMin + 0.5);
    setLocalMax(newMax);
    setPriceRange([localMin, newMax]);
  };

  const minPercentage = (localMin / maxPrice) * 100;
  const maxPercentage = (localMax / maxPrice) * 100;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <DollarSign size={16} className="text-gray-700" />
        <label className="text-sm font-medium text-gray-700">Price Range</label>
      </div>

      <div className="relative pt-6 pb-2">
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-2 bg-green-600 rounded-full"
            style={{
              left: `${minPercentage}%`,
              right: `${100 - maxPercentage}%`,
            }}
          />
        </div>

        <input
          type="range"
          min="0"
          max={maxPrice}
          step="0.5"
          value={localMin}
          onChange={(e) => handleMinChange(parseFloat(e.target.value))}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-6"
          style={{
            zIndex: localMin > maxPrice - 1 ? 5 : 3,
          }}
        />

        <input
          type="range"
          min="0"
          max={maxPrice}
          step="0.5"
          value={localMax}
          onChange={(e) => handleMaxChange(parseFloat(e.target.value))}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none top-6"
          style={{
            zIndex: 4,
          }}
        />

        <style>{`
          input[type="range"] {
            pointer-events: auto;
          }

          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #16a34a;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            pointer-events: auto;
            position: relative;
            z-index: 10;
          }

          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #16a34a;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            pointer-events: auto;
          }

          input[type="range"]::-webkit-slider-thumb:hover {
            background: #15803d;
            transform: scale(1.1);
          }

          input[type="range"]::-moz-range-thumb:hover {
            background: #15803d;
            transform: scale(1.1);
          }

          input[type="range"]:active::-webkit-slider-thumb {
            box-shadow: 0 2px 12px rgba(22, 163, 74, 0.5);
          }

          input[type="range"]:active::-moz-range-thumb {
            box-shadow: 0 2px 12px rgba(22, 163, 74, 0.5);
          }
        `}</style>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Min Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              min="0"
              max={localMax}
              step="0.5"
              value={localMin.toFixed(2)}
              onChange={(e) => handleMinChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="pt-5 text-gray-400">-</div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Max Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              min={localMin}
              max={maxPrice}
              step="0.5"
              value={localMax.toFixed(2)}
              onChange={(e) => handleMaxChange(parseFloat(e.target.value) || maxPrice)}
              className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-3 border border-green-100">
        <p className="text-sm text-gray-700">
          Showing products between{' '}
          <span className="font-bold text-green-700">${localMin.toFixed(2)}</span>
          {' '} and{' '}
          <span className="font-bold text-green-700">${localMax.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}

export default PriceRangeFilter;
