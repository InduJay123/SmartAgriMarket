import { Settings } from "lucide-react";

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
      <div className="flex gap-4 items-center justify-start mb-4 text-black">
        <Settings/>
        <h3 className="text-lg lg:text-xl font-bold ">System Activity Logs</h3>     
      </div>

     <table className="w-full min-w-[500px]">
        
        <tbody>
          {activities.map((activity, index) => (
            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 text-gray-600 text-sm">
              <td className="py-3 px-4 ">{activity.date}</td>
              <td className="py-3 px-4 ">{activity.activity}</td>
              <td className="py-3 px-4 ">{activity.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
