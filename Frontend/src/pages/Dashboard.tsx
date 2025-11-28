import { KPITicker } from '@/components/dashboard/KPITicker';
import { MapViz } from '@/components/dashboard/MapViz';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { useDashboardContext } from '@/context/DashboardContext';

export function Dashboard() {
  const { metrics, nodes, loading, epidemicData } = useDashboardContext();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Command Center</h2>
      </div>
      <KPITicker metrics={metrics} loading={loading} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 lg:col-span-5 space-y-4">
          <MapViz nodes={nodes} loading={loading} epidemicData={epidemicData} />
        </div>
        <div className="col-span-4 lg:col-span-2 space-y-4">
          <WeatherWidget />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
