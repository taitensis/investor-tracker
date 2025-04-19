import PositionList from './PositionList'
import AutoSnapshot from './AutoSnapshot'
import PnLChart from './PnLChart'
import BackfillSnapshots from './BackfillSnapshots'
BackfillSnapshots

export default function Overview() {
  return (
    <div className="space-y-6 bg-gray-50 rounded-xl border shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Portfolio Overview</h2>
      <PositionList filterByAccount={null} />
      <AutoSnapshot />
      <BackfillSnapshots />
      <PnLChart />
    </div>
  )
}
