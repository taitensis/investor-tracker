import { useState } from "react"
import AssetForm from "./AssetForm"
import Modal from "./Modal"
import { useToast } from "./ToastProvider"

export default function Settings() {
  const [showModal, setShowModal] = useState(false)
  const toast = useToast()

  const handleAssetAdded = () => {
    setShowModal(false)
    toast('✅ Asset successfully added!')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => setShowModal(true)}
      >
        + Add New Asset
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">New Asset</h3>
        <AssetForm onSubmit={handleAssetAdded} />
      </Modal>
    </div>
  )
      }

