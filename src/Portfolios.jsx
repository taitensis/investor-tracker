import PEA from './PEA'
import CTO from './CTO'

export default function Portfolios() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Portfolios</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
          <PEA />
        </div>

        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
          <CTO />
        </div>
      </div>
    </div>
  )
}
