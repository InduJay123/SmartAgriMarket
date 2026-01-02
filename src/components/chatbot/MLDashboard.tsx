import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Award,
  RefreshCw,
  X,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
} from 'lucide-react';

interface ModelMetrics {
  test_r2: number;
  test_mae: number;
  test_rmse: number;
  train_r2: number;
  train_mae: number;
  train_rmse: number;
}

interface PriceHistory {
  date: string;
  actual: number;
  predicted: number;
  product: string;
}

interface MLDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sample data for demonstration (when API is not available)
const samplePriceHistory: PriceHistory[] = [
  { date: 'Dec 26', actual: 150, predicted: 148.5, product: 'Tomato' },
  { date: 'Dec 27', actual: 155, predicted: 154.2, product: 'Tomato' },
  { date: 'Dec 28', actual: 152, predicted: 153.1, product: 'Tomato' },
  { date: 'Dec 29', actual: 158, predicted: 156.8, product: 'Tomato' },
  { date: 'Dec 30', actual: 162, predicted: 161.5, product: 'Tomato' },
  { date: 'Dec 31', actual: 160, predicted: 159.8, product: 'Tomato' },
  { date: 'Jan 1', actual: 165, predicted: 164.2, product: 'Tomato' },
];

const sampleProductAccuracy = [
  { product: 'Tomato', accuracy: 99.92 },
  { product: 'Carrot', accuracy: 99.85 },
  { product: 'Potato', accuracy: 99.78 },
  { product: 'Onion', accuracy: 99.88 },
  { product: 'Cabbage', accuracy: 99.72 },
];

const sampleDemandData = [
  { month: 'Aug', demand: 1200 },
  { month: 'Sep', demand: 1350 },
  { month: 'Oct', demand: 1500 },
  { month: 'Nov', demand: 1650 },
  { month: 'Dec', demand: 1800 },
  { month: 'Jan', demand: 1950 },
];

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function MLDashboard({ isOpen, onClose }: MLDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'price' | 'demand' | 'accuracy'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<ModelMetrics>({
    test_r2: 0.9992,
    test_mae: 0.82,
    test_rmse: 3.25,
    train_r2: 0.9992,
    train_mae: 0.87,
    train_rmse: 7.19,
  });

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'price', label: 'Price Trends', icon: LineChartIcon },
    { id: 'demand', label: 'Demand', icon: BarChart3 },
    { id: 'accuracy', label: 'Accuracy', icon: PieChartIcon },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Activity size={28} />
                    ML Model Performance Dashboard
                  </h2>
                  <p className="text-green-100 mt-1">
                    Real-time insights from our AI-powered prediction models
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshData}
                    disabled={isLoading}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                  >
                    <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 mt-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-green-700 shadow-lg'
                        : 'bg-white/20 hover:bg-white/30 text-white'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <MetricCard
                      title="Model Accuracy"
                      value={`${(metrics.test_r2 * 100).toFixed(2)}%`}
                      subtitle="R² Score"
                      icon={Target}
                      color="green"
                      trend="up"
                    />
                    <MetricCard
                      title="Avg Error (MAE)"
                      value={`Rs. ${metrics.test_mae.toFixed(2)}`}
                      subtitle="Mean Absolute Error"
                      icon={Activity}
                      color="blue"
                    />
                    <MetricCard
                      title="RMSE"
                      value={`Rs. ${metrics.test_rmse.toFixed(2)}`}
                      subtitle="Root Mean Square Error"
                      icon={BarChart3}
                      color="yellow"
                    />
                    <MetricCard
                      title="Model Status"
                      value="Active"
                      subtitle="Random Forest"
                      icon={Award}
                      color="purple"
                      trend="up"
                    />
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Price Prediction Chart */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Actual vs Predicted Prices
                      </h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={samplePriceHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="actual"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Actual Price"
                          />
                          <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="#22c55e"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 4 }}
                            name="Predicted Price"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Accuracy by Product */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Accuracy by Product
                      </h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={sampleProductAccuracy} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis type="number" domain={[99, 100]} stroke="#888" />
                          <YAxis type="category" dataKey="product" stroke="#888" width={80} />
                          <Tooltip
                            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Accuracy']}
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                            }}
                          />
                          <Bar dataKey="accuracy" fill="#22c55e" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'price' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      7-Day Price Forecast
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={samplePriceHistory}>
                        <defs>
                          <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="predicted"
                          stroke="#22c55e"
                          fillOpacity={1}
                          fill="url(#colorPredicted)"
                          name="Predicted Price"
                        />
                        <Line
                          type="monotone"
                          dataKey="actual"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 5 }}
                          name="Actual Price"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'demand' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Demand Trends (Last 6 Months)
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={sampleDemandData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="demand" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Demand (kg)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'accuracy' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Model Performance Breakdown
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Accurate', value: 99.92 },
                              { name: 'Error', value: 0.08 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                          >
                            <Cell fill="#22c55e" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Metrics Comparison */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Train vs Test Performance
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={[
                            { metric: 'R² (%)', train: 99.92, test: 99.92 },
                            { metric: 'MAE', train: 0.87, test: 0.82 },
                            { metric: 'RMSE', train: 7.19, test: 3.25 },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="metric" stroke="#888" />
                          <YAxis stroke="#888" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#fff',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                            }}
                          />
                          <Legend />
                          <Bar dataKey="train" fill="#3b82f6" name="Training" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="test" fill="#22c55e" name="Testing" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Detailed Metrics Table */}
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Detailed Model Metrics
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-gray-600 font-medium">Metric</th>
                            <th className="text-center py-3 px-4 text-gray-600 font-medium">Training</th>
                            <th className="text-center py-3 px-4 text-gray-600 font-medium">Testing</th>
                            <th className="text-center py-3 px-4 text-gray-600 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium">R² Score (Accuracy)</td>
                            <td className="py-3 px-4 text-center">{(metrics.train_r2 * 100).toFixed(2)}%</td>
                            <td className="py-3 px-4 text-center font-semibold text-green-600">
                              {(metrics.test_r2 * 100).toFixed(2)}%
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                Excellent
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium">Mean Absolute Error</td>
                            <td className="py-3 px-4 text-center">Rs. {metrics.train_mae.toFixed(2)}</td>
                            <td className="py-3 px-4 text-center font-semibold text-blue-600">
                              Rs. {metrics.test_mae.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                Low Error
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 font-medium">Root Mean Square Error</td>
                            <td className="py-3 px-4 text-center">Rs. {metrics.train_rmse.toFixed(2)}</td>
                            <td className="py-3 px-4 text-center font-semibold text-purple-600">
                              Rs. {metrics.test_rmse.toFixed(2)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                                Optimal
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  color: 'green' | 'blue' | 'yellow' | 'purple' | 'red';
  trend?: 'up' | 'down';
}

function MetricCard({ title, value, subtitle, icon: Icon, color, trend }: MetricCardProps) {
  const colorClasses = {
    green: 'bg-green-50 text-green-600 border-green-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    red: 'bg-red-50 text-red-600 border-red-100',
  };

  const iconBgClasses = {
    green: 'bg-green-100',
    blue: 'bg-blue-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
    red: 'bg-red-100',
  };

  return (
    <div className={`rounded-xl p-5 border ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${iconBgClasses[color]}`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
            {trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm font-medium mt-1">{title}</p>
        <p className="text-xs opacity-70">{subtitle}</p>
      </div>
    </div>
  );
}
