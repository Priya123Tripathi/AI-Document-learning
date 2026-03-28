export default function DashboardStatsCard({ title, value, icon, color }) {
  return (
    <div className="bg-white shadow rounded-lg p-5 flex items-center justify-between hover:shadow-lg transition">
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>

      <div className={`text-3xl p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  );
}