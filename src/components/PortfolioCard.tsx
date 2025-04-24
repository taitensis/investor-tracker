import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  color: string;
  holdings: {
    asset_id: string;
    asset_name: string;
    total_quantity: number;
    avg_price: number;
    total_cost: number;
  }[];
};

export default function PortfolioCard({ title, holdings = [], color }: Props) {
  const totalInvested = holdings.reduce(
    (acc, h) => acc + parseFloat(h.total_cost?.toString() || '0'),
    0
  );

  return (
    <Card className="shadow-md">
      <CardHeader>
      <CardTitle
  className="text-lg font-semibold flex items-center gap-2"
  style={{ color }}
>
          {color === 'green' ? <PiggyBank className="w-5 h-5" /> : <Banknote className="w-5 h-5" />} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {holdings.length === 0 ? (
          <p className="text-muted-foreground text-sm">No positions</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-muted text-muted-foreground">
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Asset</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Avg Buy Price</th>
                  <th className="px-4 py-2 text-left">Total Invested</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((pos) => (
                  <tr key={pos.asset_id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-2 whitespace-nowrap">{pos.asset_name}</td>
                    <td className="px-4 py-2">{pos.total_quantity.toFixed(4)}</td>
                    <td className="px-4 py-2">
                      €{isNaN(pos.avg_price) ? '—' : pos.avg_price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      €{isNaN(pos.total_cost) ? '—' : pos.total_cost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-medium bg-muted">
                  <td className="px-4 py-2" colSpan={3}>
                    Total Invested
                  </td>
                  <td className="px-4 py-2 text-right">
                    €{totalInvested.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}