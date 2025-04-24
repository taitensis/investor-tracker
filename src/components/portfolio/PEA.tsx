import PositionsTable from '@components/ui/PositionsTable';

export default function PEA({ holdings }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-2 text-green-600">PEA</h2>
      {holdings.length > 0 ? (
        <PositionsTable positions={holdings} />
      ) : (
        <p className="text-sm text-gray-500">No positions</p>
      )}
    </div>
  );
}