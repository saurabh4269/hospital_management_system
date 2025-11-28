import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, MapPin, Activity } from 'lucide-react';
import { useDashboardContext } from '@/context/DashboardContext';
import { cn } from '@/lib/utils';

export function SidebarEpidemicControl() {
  const { updateEpidemicData } = useDashboardContext();
  const [addresses, setAddresses] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Mock analysis delay
    setTimeout(() => {
      const newPatients = addresses.split('\n').filter(a => a.trim()).map((addr, i) => ({
        id: `patient-${i}`,
        lat: 19.0760 + (Math.random() - 0.5) * 0.1,
        lng: 72.8777 + (Math.random() - 0.5) * 0.1,
        address: addr,
        status: 'critical'
      }));

      const newHotspots = Array.from({ length: 5 }).map((_, i) => ({
        id: `hotspot-${i}`,
        lat: 19.0760 + (Math.random() - 0.5) * 0.15,
        lng: 72.8777 + (Math.random() - 0.5) * 0.15,
        intensity: Math.random()
      }));

      updateEpidemicData({
        patients: newPatients,
        hotspots: newHotspots
      });
      
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-4 w-4 text-red-500" />
        <h3 className="text-sm font-medium text-zinc-200 font-grotesk">Epidemic Intelligence</h3>
      </div>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="sidebar-report" className="text-xs text-zinc-400">Medical Report (PDF)</Label>
          <div className="border border-dashed border-zinc-700 rounded-lg p-3 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
            <Upload className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400 mb-1 transition-colors" />
            <span className="text-[10px] text-zinc-500">Drop PDF here</span>
            <Input id="sidebar-report" type="file" className="hidden" accept=".pdf" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sidebar-addresses" className="text-xs text-zinc-400">Patient Addresses</Label>
          <Textarea 
            id="sidebar-addresses" 
            placeholder="Enter addresses..." 
            className="h-[80px] resize-none text-xs bg-black/20 border-zinc-800 focus:border-emerald-500/50"
            value={addresses}
            onChange={(e) => setAddresses(e.target.value)}
          />
        </div>

        <Button 
          className={cn(
            "w-full h-8 text-xs font-medium transition-all duration-300",
            isAnalyzing 
              ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
              : "bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20"
          )}
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            <>
              <MapPin className="mr-2 h-3 w-3" />
              Analyze & Map
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
