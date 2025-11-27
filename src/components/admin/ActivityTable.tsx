interface Activity {
  date: string;
  activity: string;
  user: string;
}

interface ActivityTableProps {
  activities: Activity[];
}

export default function ActivityTable({ activities }: ActivityTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 lg:p-6 overflow-x-auto">
      <h3 className="text-lg lg:text-xl font-semibold mb-4">Recent Activities</h3>
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Activity</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-600">{activity.date}</td>
              <td className="py-3 px-4 text-gray-800">{activity.activity}</td>
              <td className="py-3 px-4 text-gray-600">{activity.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
