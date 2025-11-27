import { LineChart, BarChart } from "lucide-react";
import ActivityTable from "../components/admin/ActivityTable";
import StatCard from "../components/admin/StatCard";


const priceData = [
  { month: 'Jan', price: 110 },
  { month: 'Feb', price: 90 },
  { month: 'Mar', price: 70 },
  { month: 'Apr', price: 150 },
  { month: 'May', price: 100 },
  { month: 'Jun', price: 80 },
];

const supplyData = [
  { crop: 'Carrots', supply: 65 },
  { crop: 'Tomato', supply: 52 },
  { crop: 'Onion', supply: 45 },
  { crop: 'Potato', supply: 38 },
  { crop: 'Chilli', supply: 18 },
];

const activities = [
  { date: '2025-11-09', activity: 'Uploaded new crop price data', user: 'Admin' },
  { date: '2025-11-08', activity: 'Verified farmer account #245', user: 'Admin' },
  { date: '2025-11-08', activity: 'Updated AI model parameters', user: 'System' },
  { date: '2025-11-07', activity: 'New buyer registration approved', user: 'Admin' },
  { date: '2025-11-07', activity: 'Generated monthly analytics report', user: 'System' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard value="240" label="Farmers" color="emerald" />
        <StatCard value="180" label="Buyers" color="yellow" />
        <StatCard value="58" label="Crops" color="green" />
        <StatCard value="1,240" label="Price Updates" color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart data={priceData} title="Tomato Prices - Last 6 Months" />
        <BarChart data={supplyData} title="Top 5 Crops by Supply" />
      </div>

      <ActivityTable activities={activities} />
    </div>
  );
}
