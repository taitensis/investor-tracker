// src/pages/SettingsPage.jsx
import { useState } from 'react';

import MainLayout from '@/layouts/MainLayout';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import AssetForm from '@/components/forms/AssetForm';
import { useToast } from '@/components/toast/ToastProvider';

export default function SettingsPage() {
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  const handleAssetAdded = () => {
    setShowModal(false);
    toast('✅ Asset successfully added!');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>

      <div>
        <Button onClick={() => setShowModal(true)} variant="primary">
          + Add New Asset
        </Button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          New Asset
        </h3>
        <AssetForm onSubmit={handleAssetAdded} />
      </Modal>
    </div>
  );
}
