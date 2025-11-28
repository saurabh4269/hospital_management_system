import { Card, CardContent } from '@/components/ui/card';
import { CloudRain, Wind, Droplets } from 'lucide-react';

export function WeatherWidget() {
  return (
    <Card className="col-span-1 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 font-medium">Mumbai, IN</p>
            <h3 className="text-4xl font-bold mt-1">28°C</h3>
          </div>
          <CloudRain className="w-10 h-10 text-blue-100" />
        </div>
        
        <div className="space-y-2 mt-4">
          <div className="flex items-center justify-between text-sm text-blue-100">
            <span className="flex items-center gap-2"><Wind className="w-4 h-4" /> Wind</span>
            <span>12 km/h</span>
          </div>
          <div className="flex items-center justify-between text-sm text-blue-100">
            <span className="flex items-center gap-2"><Droplets className="w-4 h-4" /> Humidity</span>
            <span>78%</span>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-400/30">
            <p className="text-xs font-medium bg-white/20 px-2 py-1 rounded w-fit">AQI: 145 (Moderate)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
