// utils/holdings.js

export function buildHoldingsFromTrades(trades = []) {
    const holdings = {};

    for (const t of trades) {
        const key = `${t.asset_id}_${t.account_id}`; // 👈 unique per asset + account

        if (!holdings[key]) {
            holdings[key] = {
                asset_id: t.asset_id,
                account_id: t.account_id,         // ✅ retain this!
                asset_name: t.asset?.name || '',
                shares: 0,
            };
        }

        const qty = parseFloat(t.quantity);
        if (t.action === 'buy') holdings[key].shares += qty;
        else if (t.action === 'sell') holdings[key].shares -= qty;
    }

    return Object.values(holdings).filter((h) => h.shares > 0);
}
