// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/supabaseClient';

import MainLayout from '@/layouts/MainLayout';
import PerformanceSummary from '@/components/dashboard/PerformanceSummary';
import LineChart from '@/components/ui/LineChart';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { getLineChartData } from '@/utils/chartData';
import { LineChart as ChartIcon } from 'lucide-react';

export default function DashboardPage() {
    const [trades, setTrades] = useState(null);

    useEffect(() => {
        const fetchTrades = async () => {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (!user) {
                toast.error('❌ You must be logged in.');
                return;
            }

            const { data: tradeData, error: tradeError } = await supabase
                .from('trade')
                .select('*')
                .eq('user_id', user.id);

            if (tradeError) {
                toast.error('⚠️ Error fetching trades');
                return;
            }

            setTrades(tradeData || []);
        };

        fetchTrades();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>

            <PerformanceSummary />

            <Card title="Portfolio Performance">
                {trades === null ? (
                    <LoadingState message="Loading performance data..." />
                ) : trades.length === 0 ? (
                    <EmptyState message="No trade data found." icon={<ChartIcon className="h-6 w-6" />} />
                ) : (
                    <LineChart
                        title={null}
                        data={getLineChartData(trades)}
                        lines={[
                            {
                                key: 'market_value',
                                color: '#3b82f6',
                                label: 'Market Value (€)',
                            },
                            { key: 'pnl', color: '#16a64a', label: 'PnL (€)' },
                        ]}
                    />
                )}
            </Card>
        </div>
    );
}
