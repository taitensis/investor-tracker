// components/ui/DonutChart.jsx
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from 'recharts'

const COLORS = [
    '#3b82f6', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#10b981', '#6366f1', '#f43f5e', '#f87171',
]

export default function DonutChart({ title, data }) {
    return (
        <div className="p-4 border rounded-md shadow-sm bg-white dark:bg-gray-900">
            {title && <h3 className="font-semibold mb-2">{title}</h3>}
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}  