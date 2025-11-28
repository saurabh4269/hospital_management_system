import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ActionItem } from '@/types';
import { Clock, AlertTriangle, User, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  action: ActionItem;
  onReview: (action: ActionItem) => void;
}

export function ActionCard({ action, onReview }: ActionCardProps) {
  const Icon = action.type === 'staff' ? User : action.type === 'resource' ? Package : AlertTriangle;
  const isCritical = action.severity === 'high';
  
  return (
    <Card className={cn(
      "w-full transition-all duration-300 border-[#222] bg-[#0c0c0c] hover:border-[#333] group",
      isCritical && "card-critical border-l-0"
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-md border border-white/5",
            isCritical ? "bg-red-500/10 text-red-500" : "bg-white/5 text-zinc-400"
          )}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className={cn(
              "text-base font-semibold font-grotesk tracking-tight",
              isCritical ? "status-text-critical" : "text-white"
            )}>
              {action.title}
            </CardTitle>
            <div className="flex items-center text-xs text-[#666] mt-1 font-mono uppercase tracking-wider">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(action.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
        <Badge variant="outline" className={cn(
          "font-mono text-[10px] uppercase tracking-widest border-0",
          isCritical ? "bg-red-500/10 text-red-500" : "bg-white/5 text-zinc-500"
        )}>
          {action.severity}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[#999] line-clamp-2 leading-relaxed">
          {action.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onReview(action)}
          className={cn(
            "border-[#333] text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all",
            isCritical && "border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300"
          )}
        >
          Review & Approve
        </Button>
      </CardFooter>
    </Card>
  );
}
