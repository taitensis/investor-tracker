// src/pages/DividendPage.jsx
import MainLayout from '@/layouts/MainLayout';
import Card from '@/components/ui/Card';

import DividendSummaryPanel from '@/components/dividends/DividendSummaryPanel';
import DividendScheduleList from '@/components/dividends/DividendScheduleList';
import DividendForecastPanel from '@/components/dividends/DividendForecastPanel';
import DividendScheduleForm from '@/components/forms/DividendScheduleForm';
import DividendForm from '@/components/forms/DividendForm';
import DividendList from '@/components/dividends/DividendList';

export default function DividendPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dividends</h2>

      <Card title="Dividend Summary">
        <DividendSummaryPanel />
        <DividendScheduleList />
      </Card>

      <DividendForecastPanel />

      <Card title="Add Scheduled Dividend">
        <DividendScheduleForm />
      </Card>

      <Card title="Add One-Time Dividend">
        <DividendForm />
      </Card>

      <Card title="Past Dividends">
        <DividendList />
      </Card>
    </div>
  );
}
