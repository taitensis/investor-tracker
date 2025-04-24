// components/ui/LineChart.tsx
import {
  ResponsiveContainer,
  LineChart as RechartLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

type LineConfig = {
  key: string;
  color: string;
  label: string;
};

type Props = {
  title?: string;
  data: any[]; // You can refine this further to type your dataset shape
  lines: LineConfig[];
};

export default function LineChart({ title, data, lines }: Props): JSX.Element {
  return (
    <div className="p-4 sm:p-6 bg-card text-card-foreground rounded-xl shadow-sm border">
      {title && <h3 className="font-semibold text-lg mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => `€${value.toFixed(2)}`}
            labelFormatter={(label: string) => `Date: ${label}`}
          />
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
              isAnimationActive
              animationDuration={400}
            />
          ))}
        </RechartLineChart>
      </ResponsiveContainer>
    </div>
  );
}
