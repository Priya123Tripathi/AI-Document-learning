export default function RecentActivity({ activities }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 mt-6">

      {/* Heading */}
      <h3 className="text-base md:text-lg font-semibold mb-4">
        Recent Activity
      </h3>

      {/* Empty state */}
      {activities.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-6">
          No recent activity
        </p>
      )}

      <ul className="divide-y divide-gray-100">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3"
          >

            {/* Left */}
            <div className="flex flex-col">
              <p className="text-gray-700 text-sm md:text-base font-medium">
                Accessed Document: {activity.documentName}
              </p>

              <p className="text-gray-400 text-xs md:text-sm">
                {activity.date}
              </p>
            </div>

            {/* Right */}
            <button className="text-blue-600 text-sm hover:underline self-start sm:self-auto">
              View
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
}