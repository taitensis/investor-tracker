import { useState } from 'react'
import AssetForm from '../components/forms/AssetForm'
import Modal from '../components/ui/Modal'
import { useToast } from '../components/toast/ToastProvider'
import Button from '@components/ui/Button'

export default function SettingsPage() {
  const [showModal, setShowModal] = useState(false)
  const toast = useToast()

  const handleAssetAdded = () => {
    setShowModal(false)
    toast('✅ Asset successfully added!')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        Settings
      </h2>

      <button onClick={() => setShowModal(true)}>+ Add New Asset</button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          New Asset
        </h3>
        <AssetForm onSubmit={handleAssetAdded} />
      </Modal>
    </div>
  )
}
