import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { dataService } from '@/services';
import type { HospitalNode, KPIMetrics } from '@/types';

interface EpidemicData {
  patients: any[];
  hotspots: any[];
}

interface DashboardContextType {
  metrics: KPIMetrics | null;
  nodes: HospitalNode[];
  loading: boolean;
  epidemicData: EpidemicData;
  updateEpidemicData: (data: EpidemicData) => void;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [nodes, setNodes] = useState<HospitalNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [epidemicData, setEpidemicData] = useState<EpidemicData>({ 
    patients: [], 
    hotspots: [] 
  });

  const fetchData = async () => {
    try {
      const [metricsData, nodesData] = await Promise.all([
        dataService.getKPIMetrics(),
        dataService.getHospitalNodes()
      ]);
      setMetrics(metricsData);
      setNodes(nodesData);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateEpidemicData = (data: EpidemicData) => {
    setEpidemicData(data);
  };

  return (
    <DashboardContext.Provider value={{ 
      metrics, 
      nodes, 
      loading, 
      epidemicData, 
      updateEpidemicData,
      refreshData: fetchData
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
}
