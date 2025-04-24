import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import TradeForm from '@/components/forms/TradeForm';
import toast from 'react-hot-toast';
import PositionsTable from '@/components/ui/PositionsTable';

type Position = {
  asset_id: string;
  asset_name: string;
  total_quantity: number;
  avg_price: number;
  total_cost: number;
};

export default function PositionPage({
  filterByAccount = null,
}: {
  filterByAccount?: string | null;
}) {
  const [showModal, setShowModal] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);

  const fetchPositions = async () => {
    const { data, error } = await supabase.rpc('get_positions');
    if (!error) setPositions(data || []);
    else toast.error('Failed to fetch positions.');
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleAssetAdded = () => {
    setShowModal(false);
    toast.success('✅ Trade successfully added!');
    fetchPositions();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-gray-800 dark:text-white">
          Current Holdings
        </h4>
        <Button onClick={() => setShowModal(true)} variant="primary">
          + Add Trade
        </Button>
      </div>

      <PositionsTable positions={positions} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          New Trade
        </h3>
        <TradeForm onSubmit={handleAssetAdded} />
      </Modal>
    </div>
  );
}
