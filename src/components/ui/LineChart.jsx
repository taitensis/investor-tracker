// components/ui/LineChart.jsx
import {
  ResponsiveContainer,
  LineChart as RechartLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

export default function LineChart({ title, data, lines = [] }) {
  return (
    <div className="p-4 border rounded-md shadow-sm bg-white dark:bg-gray-900">
      {title && <h3 className="font-semibold mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {lines.map(({ key, color, label }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              name={label}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </RechartLineChart>
      </ResponsiveContainer>
    </div>
  )
}
