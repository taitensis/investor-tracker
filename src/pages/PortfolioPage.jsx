// src/pages/PortfolioPage.jsx
import MainLayout from '@/layouts/MainLayout';
import Card from '@/components/ui/Card';

import PEA from '@/components/portfolio/PEA';
import CTO from '@/components/portfolio/CTO';

export default function PortfolioPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Portfolios</h2>

        <div className="grid gap-6 md:grid-cols-2">
          <Card title="PEA">
            <PEA />
          </Card>

          <Card title="CTO">
            <CTO />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
