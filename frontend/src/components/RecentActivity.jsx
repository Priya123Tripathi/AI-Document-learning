export default function RecentActivity({ activities }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
      <ul>
        {activities.map((activity, index) => (
          <li
            key={index}
            className="flex justify-between py-2 border-b border-gray-100"
          >
            <div>
              <p className="text-gray-700 font-medium">
                Accessed Document: {activity.documentName}
              </p>
              <p className="text-gray-400 text-sm">{activity.date}</p>
            </div>
            <button className="text-blue-600 hover:underline">View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
