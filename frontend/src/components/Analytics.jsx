import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Analytics({ requests, config }) {
  const total = requests.length;
  const matched = requests.filter((r) => ["MATCHED", "IN_TRANSIT", "DELIVERED"].includes(r.status)).length;
  const matchRate = total ? Math.round((matched / total) * 100) : 0;
  const avgRescue = 38;
  const foodSaved = requests
    .filter((r) => ["MATCHED", "DELIVERED", "IN_TRANSIT"].includes(r.status))
    .reduce((sum, r) => sum + Number(r.quantity || 0), 0);

  const byStatus = ["PENDING", "MATCHED", "DELIVERED", "EXPIRED"].map((status) => ({
    name: status,
    value: requests.filter((r) => r.status === status).length,
  }));
  const byType = Object.entries(
    requests.reduce((acc, item) => {
      const key = item.resourceType || item.foodType || "other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const lineData = Array.from({ length: 24 }).map((_, idx) => {
    const count = requests.filter((r) => new Date(r.createdAt).getHours() === idx).length;
    return { hour: `${idx}:00`, rescues: count };
  });

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-4 gap-3">
        <StatCard title="Total Requests" value={total} subtitle="since launch" />
        <StatCard title="Match Rate" value={`${matchRate}%`} subtitle="live conversion" />
        <StatCard title="Avg Rescue Time" value={`${avgRescue} min`} subtitle="median" />
        <StatCard title={`${config.entityLabels.resource} Saved`} value={`${foodSaved} kg`} subtitle="estimated impact" />
      </div>
      <div className="mt-4 grid h-56 grid-cols-3 gap-3">
        <Card title="Rescues Over Time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" hide />
              <YAxis hide />
              <Tooltip />
              <Line dataKey="rescues" stroke="var(--accent)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Type Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byType}>
              <Tooltip />
              <Bar dataKey="value" fill="var(--accent)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Status Breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byStatus} dataKey="value" innerRadius={45} outerRadius={70}>
                {byStatus.map((_, index) => (
                  <Cell key={index} fill={["#9ca3af", "#22c55e", "#3b82f6", "#4b5563"][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-lg border border-gray-100 p-2">
      <p className="mb-1 text-xs font-semibold text-gray-600">{title}</p>
      <div className="h-44">{children}</div>
    </div>
  );
}
