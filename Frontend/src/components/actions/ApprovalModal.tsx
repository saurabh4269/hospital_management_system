import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import type { ActionItem } from '@/types';
import { Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApprovalModalProps {
  action: ActionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string, message: string) => Promise<void>;
}

export function ApprovalModal({ action, open, onOpenChange, onConfirm }: ApprovalModalProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (action) {
      // Generate default message based on action type
      const defaultMsg = action.type === 'staff' 
        ? `URGENT: ${action.title}. ${action.description} Please respond if available.`
        : `ORDER: ${action.title}. ${action.description} Priority: ${action.severity.toUpperCase()}.`;
      
      // Mock contact injection
      const footer = '\n\n- Dr. A. Patil, Chief Medical Officer';
      setMessage(defaultMsg + footer);
    }
  }, [action]);

  const handleConfirm = async () => {
    if (!action) return;
    
    setIsSubmitting(true);
    try {
      await onConfirm(action.id, message);
      toast({
        title: "Action Executed",
        description: "The command has been sent to the execution gateway.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "Failed to execute action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!action) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle>Review Action: {action.title}</DialogTitle>
          <DialogDescription>
            Review and edit the outgoing message before executing this action.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <div className="text-sm font-medium p-2 bg-muted rounded-md">
              {action.type === 'staff' ? 'Nursing Staff (All Shifts)' : 'Procurement Dept & Vendors'}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message Payload</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-32 font-mono text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSubmitting} className="gap-2">
            {isSubmitting ? (
              <CheckCircle2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Confirm & Execute
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
