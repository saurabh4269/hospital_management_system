import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { time: '00:00', oxygen: 40, staff: 24 },
  { time: '04:00', oxygen: 30, staff: 13 },
  { time: '08:00', oxygen: 20, staff: 58 },
  { time: '12:00', oxygen: 27, staff: 39 },
  { time: '16:00', oxygen: 18, staff: 48 },
  { time: '20:00', oxygen: 23, staff: 38 },
  { time: '24:00', oxygen: 34, staff: 43 },
];

export function SidebarResourceTrend() {
  return (
    <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-zinc-200 font-grotesk">Resource Trends</h3>
        <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
      </div>
      
      <div className="h-[100px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="sidebarColorOxygen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="sidebarColorStaff" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#09090b', 
                borderRadius: '8px', 
                border: '1px solid #27272a',
                fontSize: '12px'
              }}
              itemStyle={{ padding: 0 }}
            />
            <Area type="monotone" dataKey="oxygen" stroke="#10b981" fillOpacity={1} fill="url(#sidebarColorOxygen)" strokeWidth={2} />
            <Area type="monotone" dataKey="staff" stroke="#3b82f6" fillOpacity={1} fill="url(#sidebarColorStaff)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-400">Oxygen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[10px] text-zinc-400">Staff</span>
        </div>
      </div>
    </div>
  );
}
