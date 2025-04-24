// utils/dividends.js

import { parseISO } from 'date-fns';

export function buildDividendChartData(forecast) {
    const months = {};

    for (const entry of forecast) {
        const rawDate = entry.date;
        const amount = parseFloat(entry.amount) || 0;

        // ✅ Extract "YYYY-MM" from full date
        const month = rawDate?.slice(0, 7);
        if (!month) continue;

        const accountType = entry.accountType || 'Unknown';

        if (!months[month]) {
            months[month] = {
                month,
                peaIncome: 0,
                ctoIncome: 0,
                totalIncome: 0,
                peaCumulative: 0,
                ctoCumulative: 0,
                cumulative: 0,
            };
        }

        if (accountType === 'PEA') {
            months[month].peaIncome += amount;
        } else if (accountType === 'CTO') {
            months[month].ctoIncome += amount;
        }

        months[month].totalIncome += amount;
    }

    // sort months and calculate cumulative
    const sorted = Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
    let peaTotal = 0;
    let ctoTotal = 0;
    for (const m of sorted) {
        peaTotal += m.peaIncome;
        ctoTotal += m.ctoIncome;
        m.peaCumulative = peaTotal;
        m.ctoCumulative = ctoTotal;
        m.cumulative = peaTotal + ctoTotal;
    }

    return sorted;
}

export function summarizeQuarterly(forecastedDividends) {
    const byQuarter = {};
    forecastedDividends.forEach((d) => {
        const q = `Q${Math.floor((new Date(d.date).getMonth() + 3) / 3)}`;
        const amount = parseFloat(d.amount);
        if (!isNaN(amount)) {
            byQuarter[q] = (byQuarter[q] || 0) + amount;
        }
    });

    const finalByQuarter = ['Q1', 'Q2', 'Q3', 'Q4'].reduce((acc, q) => {
        acc[q] = byQuarter[q] || 0;
        return acc;
    }, {});

    return finalByQuarter;
}