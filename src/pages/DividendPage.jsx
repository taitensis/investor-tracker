// src/pages/DividendPage.jsx
import DividendList from '@components/dividends/DividendList'
import DividendForm from '@components/forms/DividendForm'
import DividendForecastPanel from '@components/dividends/DividendForecastPanel'
import DividendScheduleForm from '@components/forms/DividendScheduleForm'
import DividendSummaryPanel from '@components/dividends/DividendSummaryPanel'
import DividendScheduleList from '@components/dividends/DividendScheduleList'
import { getForecastedDividends, getMonthlyDividendMap } from '@utils/dividendForecast'

export default function DividendPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold">Dividends</h2>
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-semibold mb-2">Dividend Summary</h3>
                <DividendSummaryPanel />
                <DividendScheduleList />
            </div>
            <DividendForecastPanel />
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-semibold mb-2">Add Dividend</h3>
                <DividendScheduleForm />
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-semibold mb-2">Add Dividend</h3>
                <DividendForm />
            </div>

            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-semibold mb-2">Past Dividends</h3>
                <DividendList />
            </div>
        </div>
    )
}
