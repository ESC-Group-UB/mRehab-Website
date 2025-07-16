import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function AccuracyGraph({ data }: { data: any[] }) {
  const sorted = [...data].sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📈 Accuracy Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sorted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Timestamp" tickFormatter={(val) => new Date(val).toLocaleDateString()} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="Accuracy" stroke="#4f46e5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
