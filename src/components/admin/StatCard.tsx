interface StatCardProps {
  value: string;
  label: string;
  color: 'emerald' | 'yellow' | 'green' | 'blue';
}

const colorClasses = {
  emerald: 'bg-emerald-500',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
};

export default function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div className={`${colorClasses[color]} rounded-lg shadow-lg p-6 lg:p-8 text-white`}>
      <div className="text-4xl lg:text-5xl font-bold mb-2">{value}</div>
      <div className="text-lg lg:text-xl font-medium opacity-90">{label}</div>
    </div>
  );
}
