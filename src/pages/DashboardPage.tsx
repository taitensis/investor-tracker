import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/supabaseClient';

import MainLayout from '@/layouts/MainLayout';
import PerformanceSummary from '@/components/dashboard/PerformanceSummary';
import LineChart from '@/components/ui/LineChart';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { getLineChartData } from '@/utils/chartData';
import { LineChart as ChartIcon } from 'lucide-react';

type Trade = {
  id: string;
  user_id: string;
  asset_id: string;
  action: string;
  quantity: number;
  price_per_unit: number;
  created_at: string;
};

export default function DashboardPage() {
  const [trades, setTrades] = useState<Trade[] | null>(null);

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

      setTrades(tradeData as Trade[] || []);
    };

    fetchTrades();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Overview of your portfolio performance
        </p>
      </div>

      <PerformanceSummary />

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
          <CardDescription>
            Visual representation of your portfolio market value and PnL.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {trades === null ? (
            <LoadingState message="Loading performance data..." />
          ) : trades.length === 0 ? (
            <EmptyState
              message="No trade data found."
              icon={
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                  <ChartIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              }
            />
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
        </CardContent>
      </Card>
    </div>
  );
}
