import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/supabaseClient';

import { buildHoldingsFromTrades } from '@/utils/holdings';
import { fetchTradesByUser } from '@/utils/supabaseQueries'; // ✅ Supabase util
import PortfolioCard from '@/components/PortfolioCard'; // ✅ Your card component
import { CHART_COLORS } from '@/constants/colors';

export default function PortfolioPage() {
  const [peaHoldings, setPeaHoldings] = useState([]);
  const [ctoHoldings, setCtoHoldings] = useState([]);

  const colorPea = CHART_COLORS.pea;
  const colorCto = CHART_COLORS.cto;

  useEffect(() => {


    const load = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user?.id) {
        toast.error('You must be logged in to view your portfolio.');
        return;
      }

      try {
        const { data, error: rpcError } = await supabase.rpc('get_positions_with_account');

        if (rpcError) {
          throw rpcError;
        }

        setPeaHoldings(data.filter((p) => p.account_type === 'PEA'));
        setCtoHoldings(data.filter((p) => p.account_type === 'CTO'));
      } catch (err) {
        toast.error('Could not load portfolio.');
      }
    };

    load();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
  Your Portfolios
</h2>
<p className="text-sm text-muted-foreground">
  Breakdown of your holdings by account type
</p>
      <PortfolioCard title="PEA" holdings={peaHoldings} color={colorPea} />
      <PortfolioCard title="CTO" holdings={ctoHoldings} color={colorCto} />
    </div>
  );
}
