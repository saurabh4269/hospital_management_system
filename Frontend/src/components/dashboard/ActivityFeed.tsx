import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle2, Truck, UserPlus, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const activities = [
  { id: 1, type: 'alert', message: 'Critical Oxygen levels at Central City Hospital', time: '2 mins ago', color: 'text-red-500', details: 'Oxygen levels dropped below 15% in ICU Ward B. Immediate resupply required.' },
  { id: 2, type: 'success', message: 'Staff deployment approved for Ward A', time: '15 mins ago', color: 'text-green-500', details: 'Additional 5 nursing staff deployed to handle surge capacity.' },
  { id: 3, type: 'info', message: 'Supply truck dispatched to South Bombay', time: '45 mins ago', color: 'text-blue-500', details: 'Truck #TRK-882 carrying medical supplies estimated arrival in 30 mins.' },
  { id: 4, type: 'warning', message: 'Surge prediction increased to 85%', time: '1 hour ago', color: 'text-amber-500', details: 'AI models predict high patient influx due to local festival gathering.' },
  { id: 5, type: 'success', message: 'Shift handover completed successfully', time: '2 hours ago', color: 'text-green-500', details: 'Morning shift handover completed with 100% staff attendance.' },
];

export function ActivityFeed() {
  const [selectedActivity, setSelectedActivity] = useState<typeof activities[0] | null>(null);

  return (
    <>
      <Card className="col-span-3 lg:col-span-3 h-[350px]">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[280px] pr-4">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors group"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className={`${activity.color} mt-0.5`}>
                    {activity.type === 'alert' && <AlertCircle className="w-5 h-5" />}
                    {activity.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                    {activity.type === 'info' && <Truck className="w-5 h-5" />}
                    {activity.type === 'warning' && <UserPlus className="w-5 h-5" />}
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none group-hover:text-emerald-400 transition-colors">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="bg-[#09090b] border-[#27272a] text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedActivity?.type === 'alert' && <AlertCircle className="w-5 h-5 text-red-500" />}
              {selectedActivity?.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {selectedActivity?.type === 'info' && <Truck className="w-5 h-5 text-blue-500" />}
              {selectedActivity?.type === 'warning' && <UserPlus className="w-5 h-5 text-amber-500" />}
              Activity Details
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {selectedActivity?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="text-sm font-medium text-zinc-200 mb-2">{selectedActivity?.message}</h4>
            <p className="text-sm text-zinc-400 bg-white/5 p-4 rounded-lg border border-white/10">
              {selectedActivity?.details}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedActivity(null)} className="border-zinc-700 hover:bg-zinc-800 text-zinc-300">
              Close
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Acknowledge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
