type Position = {
  asset_id: string;
  account_id: string;
  asset_name: string;
  total_quantity: number;
  avg_price: number | string;
  total_cost: number | string;
};

type Props = {
  positions?: Position[];
};

export default function PositionsTable({ positions = [] }: Props) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-muted text-muted-foreground">
          <tr className="border-b">
            <th className="px-4 py-2 text-left font-semibold">Asset</th>
            <th className="px-4 py-2 text-left font-semibold">Quantity</th>
            <th className="px-4 py-2 text-left font-semibold">Avg Buy Price</th>
            <th className="px-4 py-2 text-left font-semibold">Total Invested</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((pos) => (
            <tr
              key={`${pos.asset_id}-${pos.account_id}`}
              className="border-b hover:bg-muted/50 transition-colors"
            >
              <td className="px-4 py-2">{pos.asset_name}</td>
              <td className="px-4 py-2">
                {Number(pos.total_quantity).toFixed(4)}
              </td>
              <td className="px-4 py-2">
                €{isNaN(Number(pos.avg_price)) ? '—' : Number(pos.avg_price).toFixed(2)}
              </td>
              <td className="px-4 py-2">
                €{isNaN(Number(pos.total_cost)) ? '—' : Number(pos.total_cost).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
