// src/pages/PositionPage.jsx
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import MainLayout from '@/layouts/MainLayout';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';

import { supabase } from '@/supabaseClient';
import { fetchMarketPrice } from '@/services/price';
import { fetchTradesByUser } from '@/utils/supabaseQueries';
import { buildPositionsFromTrades } from '@/utils/portfolioUtils';

export default function PositionPage() {
  const [positions, setPositions] = useState(null);

  useEffect(() => {
    const loadPositions = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('❌ You must be logged in.');
        return;
      }

      const trades = await fetchTradesByUser(user.id);
      const results = await buildPositionsFromTrades(trades, fetchMarketPrice);
      setPositions(results);
    };

    loadPositions();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Current Positions</h2>

      {positions === null ? (
        <LoadingState message="Loading your positions..." />
      ) : positions.length === 0 ? (
        <EmptyState message="No holdings yet." />
      ) : (
        <div className="grid gap-4">
          {positions.map((pos, i) => (
            <Card
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <div className="font-medium text-gray-800 dark:text-white">
                  {pos.asset.name}
                </div>
                <div className="text-sm text-gray-500">
                  {pos.marketValue !== '-' ? `€${pos.marketValue}` : '-'}
                </div>
              </div>

              <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <div>
                  P&amp;L:{' '}
                  {pos.percentChange !== null ? (
                    <strong
                      className={
                        parseFloat(pos.pnl) < 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }
                    >
                      {pos.percentChange}%
                    </strong>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
