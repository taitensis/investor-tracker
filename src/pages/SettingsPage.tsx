// src/pages/SettingsPage.tsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';

import { Button, buttonVariants } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
//import Modal from '@/components/ui/Modal';
import AssetForm from '@/components/forms/AssetForm';


export default function SettingsPage() {
  //const [showModal, setShowModal] = useState<boolean>(false);

  const [open, setOpen] = useState(false);

  const handleAssetAdded = () => {
    //setShowModal(false);
    setOpen(false);
    toast.success('✅ Asset successfully added!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Settings
      </h2>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size='lg'>
            + Add New Asset
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              New Asset
            </DialogTitle>
          </DialogHeader>
          <AssetForm onSubmit={handleAssetAdded} />
        </DialogContent>
      </Dialog>
      </div>
  );
}

//       <div>
//         <Button onClick={() => setShowModal(true)} variant="primary">
//           + Add New Asset
//         </Button>
//       </div>

//       <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//         <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
//           New Asset
//         </h3>
//         <AssetForm onSubmit={handleAssetAdded} />
//       </Modal>
//     </div>
//   );
// }
