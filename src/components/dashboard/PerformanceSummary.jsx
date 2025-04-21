import PositionPage from '@pages/PositionPage'
import AutoSnapshot from '@services/snapshot/AutoSnapshot'
import BackfillSnapshots from '@services/snapshot/BackfillSnapshots'
BackfillSnapshots

export default function PerformanceSummary() {
  return (
    <div className="space-y-6 bg-gray-50 rounded-xl border shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Portfolio Overview</h2>
      <PositionPage filterByAccount={null} />
      <AutoSnapshot />
    </div>
  )
}
