import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, MapPin, Activity } from 'lucide-react';

interface EpidemicControlPanelProps {
  onUpdateData: (data: any) => void;
}

export function EpidemicControlPanel({ onUpdateData }: EpidemicControlPanelProps) {
  const [addresses, setAddresses] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Mock analysis delay
    setTimeout(() => {
      // Mock geocoding and prediction logic
      // In a real app, this would send the PDF and addresses to a backend
      
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

      onUpdateData({
        patients: newPatients,
        hotspots: newHotspots
      });
      
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-500" />
          Epidemic Intelligence
        </CardTitle>
        <CardDescription>
          Upload medical reports or enter patient addresses to predict viral hotspots.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="report">Medical Report (PDF)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">Drop PDF report here</span>
              <Input id="report" type="file" className="hidden" accept=".pdf" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addresses">Patient Addresses</Label>
            <Textarea 
              id="addresses" 
              placeholder="Enter addresses (one per line)..." 
              className="h-[120px] resize-none"
              value={addresses}
              onChange={(e) => setAddresses(e.target.value)}
            />
          </div>
        </div>

        <Button 
          className="w-full bg-red-600 hover:bg-red-700 text-white" 
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>Analyzing Data & Updating Models...</>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Analyze & Map Hotspots
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
