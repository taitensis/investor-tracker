import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Legend,
    Tooltip,
    CartesianGrid,
} from 'recharts';
import { CHART_COLORS } from '@/constants/colors';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';

function formatMonthLabel(dateStr) {
    const d = parseISO(dateStr + '-01');
    return format(d, "MMM ''yy");
}

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="rounded-xl bg-card text-card-foreground p-3 shadow-lg border border-muted text-xs space-y-1">
                <div className="font-semibold">
                    {formatMonthLabel(label)}
                </div>
                <div className="text-muted-foreground">PEA: €{(d.peaIncome || 0).toFixed(2)}</div>
                <div className="text-muted-foreground">CTO: €{(d.ctoIncome || 0).toFixed(2)}</div>
                <div className="text-muted-foreground font-medium">Total: €{(d.totalIncome || 0).toFixed(2)}</div>
                <hr className="border-t border-muted my-1" />
                <div className="text-muted-foreground">PEA Cumulative: €{(d.peaCumulative || 0).toFixed(2)}</div>
                <div className="text-muted-foreground">CTO Cumulative: €{(d.ctoCumulative || 0).toFixed(2)}</div>
                <div className="text-muted-foreground font-medium">Total Cumulative: €{(d.cumulative || 0).toFixed(2)}</div>
            </div>
        );
    }
    return null;
}

const ranges = {
    '12mo': 12,
    '6mo': 6,
    '3mo': 3,
};

export default function DividendChart({ data = [] }) {
    const [range, setRange] = useState('12mo');
    const filtered = data.slice(0, ranges[range]);

    if (!data.length) {
        return (
            <div className="text-sm text-muted-foreground italic">
                No data to display.
            </div>
        );
    }

    return (
        <div className="w-full bg-card text-card-foreground p-4 sm:p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h4 className="text-base sm:text-sm font-semibold tracking-tight">
                    Projected Dividends
                </h4>
                <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                    {Object.keys(ranges).map((key) => (
                        <button
                            key={key}
                            onClick={() => setRange(key)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${range === key
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-white'
                                : 'text-muted-foreground hover:bg-muted/50'
                                }`}
                        >
                            {key.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={filtered}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" tickFormatter={formatMonthLabel} fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36} />

                        <Bar
                            dataKey="peaIncome"
                            stackId="a"
                            barSize={2.5}
                            fill={CHART_COLORS.pea}
                            radius={[4, 4, 0, 0]}
                            name="PEA"
                        />
                        <Bar
                            dataKey="ctoIncome"
                            stackId="a"
                            barSize={2.5}
                            fill={CHART_COLORS.cto}
                            radius={[4, 4, 0, 0]}
                            name="CTO"
                        />

                        <Line
                            dataKey="peaCumulative"
                            stroke={CHART_COLORS.pea}
                            strokeWidth={1}
                            dot={false}
                            name="PEA (Cumulative)"
                        />
                        <Line
                            dataKey="ctoCumulative"
                            stroke={CHART_COLORS.cto}
                            strokeWidth={1}
                            dot={false}
                            name="CTO (Cumulative)"
                        />
                        <Line
                            dataKey="cumulative"
                            stroke={CHART_COLORS.total}
                            strokeWidth={1}
                            dot={false}
                            name="Total (Cumulative)"
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}