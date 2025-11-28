import { useEffect, useState } from 'react';
import { ActionCard } from '@/components/actions/ActionCard';
import { ApprovalModal } from '@/components/actions/ApprovalModal';
import { dataService } from '@/services';
import type { ActionItem } from '@/types';
import { Loader2 } from 'lucide-react';

export function ActionHub() {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchActions = async () => {
    try {
      const data = await dataService.getPendingActions();
      setActions(data);
    } catch (error) {
      console.error('Failed to fetch actions', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleReview = (action: ActionItem) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const handleConfirm = async (id: string, message: string) => {
    await dataService.approveAction(id, { message });
    // Remove the action from the list locally
    setActions(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-grotesk text-white">Action Hub</h2>
          <p className="text-[#666] font-mono text-sm mt-1">Pending approvals and system alerts</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#666]" />
          </div>
        ) : actions.length === 0 ? (
          <div className="col-span-full text-center py-12 text-[#666] font-mono">
            No pending actions required. System is stable.
          </div>
        ) : (
          actions.map((action) => (
            <ActionCard 
              key={action.id} 
              action={action} 
              onReview={handleReview} 
            />
          ))
        )}
      </div>

      <ApprovalModal 
        action={selectedAction}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
