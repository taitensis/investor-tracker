import PEA from '@components/portfolio/PEA'
import CTO from '@components/portfolio/CTO'

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Portfolios</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* PEA Portfolio */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">PEA</h3>
          <div className="border-t pt-2">
            <PEA />
          </div>
        </div>

        {/* CTO Portfolio */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">CTO</h3>
          <div className="border-t pt-2">
            <CTO />
          </div>
        </div>
      </div>
    </div>
  )
}
