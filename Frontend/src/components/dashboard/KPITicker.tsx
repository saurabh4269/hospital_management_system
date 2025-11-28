import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { KPIMetrics } from '@/types';
import { Activity, AlertTriangle, Hospital, TrendingUp } from 'lucide-react';
import { MetricDetailModal } from './MetricDetailModal';

interface KPITickerProps {
  metrics: KPIMetrics | null;
  loading: boolean;
}

export function KPITicker({ metrics, loading }: KPITickerProps) {
  const [selectedMetric, setSelectedMetric] = useState<{
    label: string;
    value: string | number;
    trend: number;
    type: keyof KPIMetrics;
  } | null>(null);

  if (loading || !metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: 'Avg Occupancy',
      value: `${metrics.occupancyRate}%`,
      icon: Hospital,
      description: 'Across all monitored nodes',
      trend: metrics.occupancyRate > 80 ? 'critical' : 'normal',
      type: 'occupancyRate' as keyof KPIMetrics,
      trendValue: 12
    },
    {
      title: 'Surge Confidence',
      value: `${metrics.surgeConfidence}%`,
      icon: TrendingUp,
      description: 'AI Prediction Score',
      trend: metrics.surgeConfidence > 75 ? 'critical' : 'normal',
      type: 'surgeConfidence' as keyof KPIMetrics,
      trendValue: 5
    },
    {
      title: 'Active Alerts',
      value: metrics.activeAlerts,
      icon: Activity,
      description: 'Pending actions',
      trend: metrics.activeAlerts > 5 ? 'warning' : 'normal',
      type: 'activeAlerts' as keyof KPIMetrics,
      trendValue: -2
    },
    {
      title: 'Critical Hospitals',
      value: metrics.criticalHospitals,
      icon: AlertTriangle,
      description: 'Requiring immediate attention',
      trend: metrics.criticalHospitals > 0 ? 'critical' : 'normal',
      type: 'criticalHospitals' as keyof KPIMetrics,
      trendValue: 1
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <Card 
            key={item.title} 
            className="cursor-pointer hover:bg-white/5 transition-colors border-zinc-800"
            onClick={() => setSelectedMetric({
              label: item.title,
              value: item.value,
              trend: item.trendValue,
              type: item.type
            })}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {item.title}
              </CardTitle>
              <item.icon className={`h-4 w-4 ${
                item.trend === 'critical' ? 'text-red-500' : 
                item.trend === 'warning' ? 'text-amber-500' : 'text-emerald-500'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <p className="text-xs text-zinc-500">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <MetricDetailModal 
        isOpen={!!selectedMetric}
        onClose={() => setSelectedMetric(null)}
        metric={selectedMetric}
      />
    </>
  );
}
