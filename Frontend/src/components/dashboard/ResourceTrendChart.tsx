import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', oxygen: 40, staff: 24, beds: 24 },
  { time: '04:00', oxygen: 30, staff: 13, beds: 22 },
  { time: '08:00', oxygen: 20, staff: 58, beds: 22 },
  { time: '12:00', oxygen: 27, staff: 39, beds: 20 },
  { time: '16:00', oxygen: 18, staff: 48, beds: 21 },
  { time: '20:00', oxygen: 23, staff: 38, beds: 25 },
  { time: '24:00', oxygen: 34, staff: 43, beds: 21 },
];

export function ResourceTrendChart() {
  return (
    <Card className="col-span-4 lg:col-span-4 h-[350px]">
      <CardHeader>
        <CardTitle>Resource Utilization Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOxygen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorStaff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="oxygen" stroke="#10b981" fillOpacity={1} fill="url(#colorOxygen)" strokeWidth={2} />
            <Area type="monotone" dataKey="staff" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStaff)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
