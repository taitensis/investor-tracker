// utils/supabaseQueries.js
import { supabase } from '@/supabaseClient';

export async function fetchTradesByUser(userId) {
  const { data, error } = await supabase
    .from('trade')
    .select('action, quantity, price_per_unit, asset_id, account_id, asset (id, name)')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
  return data;
}

export async function fetchAccountsByUser(userId) {
  const { data: account, error: accountError } = await supabase
    .from('account')
    .select('id, type')
    .eq('user_id', userId);

  if (accountError) throw new Error(accountError.message);
  if (!account.length) return [];

  return account;
}

export async function fetchDividendSchedulesByUser(userId) {
  // Fetch the user's assets that have a linked forecast
  const { data: assets, error: assetError } = await supabase
    .from('asset')
    .select('id, name, dividends_id')
    .eq('user_id', userId)
    .not('dividends_id', 'is', null);

  if (assetError) throw new Error(assetError.message);
  if (!assets.length) return [];

  // Gather all linked dividend_forecast records
  const forecastIds = assets.map((a) => a.dividends_id);

  const { data: forecasts, error: forecastError } = await supabase
    .from('dividend_forecast')
    .select('*')
    .in('id', forecastIds);

  if (forecastError) throw new Error(forecastError.message);

  // Attach asset info to forecasts
  return forecasts.map((forecast) => {
    const asset = assets.find((a) => a.dividends_id === forecast.id);
    return {
      ...forecast,
      asset_id: asset?.id,
      asset_name: asset?.name,
    };
  });
}

