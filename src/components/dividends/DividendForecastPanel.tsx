import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import toast from 'react-hot-toast';

import {
  fetchTradesByUser,
  fetchDividendSchedulesByUser,
  fetchAccountsByUser,
} from '@/utils/supabaseQueries';

import { buildHoldingsFromTrades } from '@/utils/holdings';
import { getForecastedDividends } from '@/utils/dividendForecast';
import { buildDividendChartData } from '@/utils/dividends';

import DividendChart from '@components/dividends/DividendChart';

export default function DividendForecastPanel() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user?.id) {
        toast.error('You must be logged in to view your dividends.');
        return;
      }

      try {
        const [trades, schedules, accounts] = await Promise.all([
          fetchTradesByUser(user.id),
          fetchDividendSchedulesByUser(user.id),
          fetchAccountsByUser(user.id),
        ]);

        const accountMap = Object.fromEntries(
          accounts.map((a) => [a.id, a.type?.toUpperCase()])
        );

        const holdings = buildHoldingsFromTrades(trades);
        holdings.forEach((h) => {
          h.account_type = accountMap[h.account_id] || 'UNKNOWN';
        });

        const forecast = getForecastedDividends({ holdings, schedules });
        const chartData = buildDividendChartData(forecast);

        setData(chartData);
      } catch (err) {
        console.error('❌ Error loading dividend data:', err);
        toast.error('Could not load dividend forecast.');
      }
    };

    load();
  }, []);

  if (!data.length) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Loading dividend forecast...
      </div>
    );
  }

  return <DividendChart data={data} />;
}