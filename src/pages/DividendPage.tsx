import MainLayout from '@/layouts/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import DividendSummaryPanel from '@/components/dividends/DividendSummaryPanel';
import DividendScheduleList from '@/components/dividends/DividendScheduleList';
import DividendForecastPanel from '@/components/dividends/DividendForecastPanel';
import DividendScheduleForm from '@/components/forms/DividendScheduleForm';
import DividendForm from '@/components/forms/DividendForm';
import DividendList from '@/components/dividends/DividendList';

export default function DividendPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Dividends
      </h2>

      <DividendSummaryPanel />

      <Card>
        <CardHeader>
          <CardTitle>About Dividends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            This page provides an overview of your dividend income, including estimated annual dividends, next payment dates, and a forecast of future payments. You can also add scheduled and one-time dividends, and view past dividends.</p>
          <p>
            <strong>Note:</strong> The dividend forecast is based on your current holdings and scheduled dividends. It may not reflect actual future payments. Please verify with your broker or financial advisor.
          </p>
        </CardContent>
      </Card>

      <DividendForecastPanel />

      {/* Future features to be enabled */}
      {/* <DividendScheduleList /> */}
      {/* <DividendScheduleForm /> */}
      {/* <DividendForm /> */}
      {/* <DividendList /> */}
    </div>
  );
}
