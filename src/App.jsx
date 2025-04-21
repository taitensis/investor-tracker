import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@layouts/MainLayout'
import DashboardPage from '@pages/DashboardPage'
import PositionPage from '@pages/PositionPage'
import SettingsPage from '@pages/SettingsPage'
import DividendPage from '@pages/DividendPage'

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/portfolio" element={<PositionPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/dividend" element={<DividendPage />} />
        </Routes>
      </MainLayout>
    </Router>
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