import { useState } from 'react'
import Overview from './Overview'
import AssetForm from './AssetForm'
import { useToast } from './components/toast/ToastProvider'
import Sidebar from './Sidebar'
import Portfolios from './Portfolios'
import Settings from './Settings'

export default function App() {
  const toast = useToast()
  const [activeTab, setActiveTab] = useState('overview')

  const TABS = {
    overview: <Overview />,
    portfolios: <Portfolios />,
    assetEditor: <AssetForm />,
    settings: <Settings />,
  }

  return (
    <div className="md:flex min-h-screen bg-gray-100 text-gray-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg w-full shadow-md">
        {TABS[activeTab] || <p>Select a tab</p>}
      </div>
    </div>
  )
}


/*
        <div className="min-h-screen bg-gray-100 text-gray-800">
          {/* Top bar with buttons 
          <div className="bg-white shadow-md p-4 flex space-x-4 justify-center border-b">
        
            {/* Navigation buttons 
            <button
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'pea'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              onClick={() => setActiveTab('pea')}
            >
              PEA
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'cto'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              onClick={() => setActiveTab('cto')}
            >
              CTO
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'assetEditor'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              onClick={() => setActiveTab('assetEditor')}
            >
              Asset Editor
            </button>
          </div>
      
          {/* Content area 
          <div className="p-4">
            {activeTab === 'overview' && <Overview />}
            {activeTab === 'pea' && <PEA />}
            {activeTab === 'cto' && <CTO />}
            {activeTab === 'assetEditor' && <AssetForm />}
          </div>
        </div>
      )   */