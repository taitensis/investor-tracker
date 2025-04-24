import React from 'react';
import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { supabase } from '@/supabaseClient';

import StatCard from '@/components/ui/StatCard';

import { fetchTradesByUser, fetchDividendSchedulesByUser } from '@/utils/supabaseQueries';
import { buildHoldingsFromTrades } from '@/utils/holdings';
import { getForecastedDividends } from '@/utils/dividendForecast';
import { summarizeQuarterly } from '@/utils/dividends';
import { Card, CardContent } from '@/components/ui/card';

export default function DividendSummaryPanel() {
    const [summary, setSummary] = useState(null);

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

            const userId = user.id;

            const trades = await fetchTradesByUser(userId);
            const schedules = await fetchDividendSchedulesByUser(userId);
            const holdings = buildHoldingsFromTrades(trades);

            let totalCost = 0;
            let totalMarketValue = 0;

            trades.forEach((t) => {
                const qty = parseFloat(t.quantity);
                const price = parseFloat(t.price_per_unit || 0);
                if (t.action === 'buy') totalCost += qty * price;
                else if (t.action === 'sell') totalCost -= qty * price;
            });

            holdings.forEach((h) => {
                totalMarketValue += (h.estimatedMarketPrice || 0) * h.shares;
            });

            const forecast = getForecastedDividends({ holdings, schedules });

            const total12moIncome = forecast.reduce(
                (sum, d) => sum + (parseFloat(d.amount) || 0),
                0
            );

            const monthlyAvg = total12moIncome / 12;
            const dailyAvg = total12moIncome / 365;
            const portfolioYield = totalMarketValue > 0 ? total12moIncome / totalMarketValue : null;
            const yieldOnCost = totalCost > 0 ? total12moIncome / totalCost : null;

            const next = forecast
                .filter((d) => new Date(d.date) > new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

            const byQuarter = summarizeQuarterly(forecast);

            setSummary({
                total: total12moIncome,
                monthlyAvg,
                dailyAvg,
                portfolioYield,
                yieldOnCost,
                next,
                byQuarter,
            });
        };

        load();
    }, []);

    if (!summary || summary.total === 0) {
        return (
            <Card>
                <CardContent className="text-sm text-muted-foreground">
                    No dividend data found. Start by logging some trades or scheduled dividends.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wide">
                Dividend Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <StatCard
                    type="euro"
                    label="Estimated Annual Dividends"
                    main={`€${summary.total?.toFixed(2) ?? '—'}`}
                    tone="primary"
                >
                    <div className="grid grid-cols-2 gap-x-4">
                        <div>Monthly Avg</div>
                        <div className="text-right font-semibold">€{summary.monthlyAvg?.toFixed(2) ?? '—'}</div>
                        <div>Daily Avg</div>
                        <div className="text-right font-semibold">€{summary.dailyAvg?.toFixed(2) ?? '—'}</div>
                        <div>Yield</div>
                        <div className="text-right font-semibold text-green-600">
                            {summary.portfolioYield !== null ? `${(summary.portfolioYield * 100).toFixed(2)}%` : '—'}
                        </div>
                        <div>Yield on Cost</div>
                        <div className="text-right font-semibold text-blue-600">
                            {summary.yieldOnCost !== null ? `${(summary.yieldOnCost * 100).toFixed(2)}%` : '—'}
                        </div>
                    </div>
                </StatCard>

                <StatCard
                    type="calendar"
                    label="Next Payment"
                    main={
                        summary.next
                            ? format(new Date(summary.next.date), 'PPP')
                            : '—'
                    }
                    tone="accent"
                >
                    <div className="space-y-1 text-sm text-muted-foreground">
                        {summary.next?.asset && (
                            <div className="font-medium break-words">
                                {summary.next.asset}
                            </div>
                        )}
                        {summary.next?.date && (
                            <div>
                                in{' '}
                                <span className="font-semibold text-foreground">
                                    {formatDistanceToNow(new Date(summary.next.date), { addSuffix: false })}
                                </span>
                            </div>
                        )}
                    </div>
                </StatCard>

                <StatCard
                    type="chart"
                    label="Quarterly Forecast"
                    tone="subtle"
                >
                    <div className="grid grid-cols-2 gap-y-1 font-mono">
                        {Object.entries(summary.byQuarter).map(([q, v]) => (
                            <React.Fragment key={q}>
                                <div className="text-muted-foreground">{q}</div>
                                <div className="text-right font-semibold text-foreground">
                                    €{Number(v).toFixed(2)}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </StatCard>
            </div>
        </div>
    );
}
