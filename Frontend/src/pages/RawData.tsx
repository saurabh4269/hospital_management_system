import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  ArrowUpDown, 
  Search, 
  Download, 
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  Clock,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Data
const MOCK_DATA = Array.from({ length: 50 }).map((_, i) => ({
  id: `EVT-${1000 + i}`,
  timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
  hospital: ['Central City Hospital', 'South Bombay Medical', 'Metro General', 'Westside Clinic'][Math.floor(Math.random() * 4)],
  type: ['Admission', 'Transfer', 'Resource Alert', 'Discharge'][Math.floor(Math.random() * 4)],
  severity: ['Critical', 'High', 'Medium', 'Low'][Math.floor(Math.random() * 4)],
  status: ['Pending', 'In Progress', 'Resolved'][Math.floor(Math.random() * 3)],
  details: 'Patient presented with severe symptoms...'
}));

type SortConfig = {
  key: keyof typeof MOCK_DATA[0];
  direction: 'asc' | 'desc';
} | null;

export function RawData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const handleSort = (key: keyof typeof MOCK_DATA[0]) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = MOCK_DATA.filter(item => {
    const matchesSearch = 
      item.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || item.severity.toLowerCase() === filterSeverity.toLowerCase();

    return matchesSearch && matchesSeverity;
  }).sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4 text-orange-400" />;
      case 'in progress': return <Activity className="w-4 h-4 text-blue-400" />; // Note: Activity needs import
      case 'resolved': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default: return <AlertCircle className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Raw Data Streams</h2>
          <p className="text-muted-foreground mt-1">Live feed of hospital events and system logs.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="border-zinc-800 bg-black/40 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Event Log</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  className="pl-8 bg-zinc-900/50 border-zinc-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="h-10 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-900/50 text-zinc-400 font-medium uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('timestamp')}>
                    <div className="flex items-center gap-1">
                      Timestamp
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1">
                      ID
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('hospital')}>
                    <div className="flex items-center gap-1">
                      Hospital
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('type')}>
                    <div className="flex items-center gap-1">
                      Type
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('severity')}>
                    <div className="flex items-center gap-1">
                      Severity
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3 font-mono text-zinc-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-zinc-300">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-200">
                      {item.hospital}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {item.type}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border", getSeverityColor(item.severity))}>
                        {item.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <span className="text-zinc-300">{item.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-xs text-zinc-500 text-center">
            Showing {filteredData.length} events
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
