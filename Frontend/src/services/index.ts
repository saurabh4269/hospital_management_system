import type { ActionItem, DataService, HospitalNode, KPIMetrics } from '../types';
import { MockDataService } from './MockDataService';

// Placeholder for real service
class LiveDataService implements DataService {
  async getHospitalNodes(): Promise<HospitalNode[]> { throw new Error('Not implemented'); }
  async getPendingActions(): Promise<ActionItem[]> { throw new Error('Not implemented'); }
  async getKPIMetrics(): Promise<KPIMetrics> { throw new Error('Not implemented'); }
  async approveAction(_id: string, _payload?: any): Promise<void> { throw new Error('Not implemented'); }
  async rejectAction(_id: string): Promise<void> { throw new Error('Not implemented'); }
  async generateAdvisory(_prompt: string): Promise<string> { throw new Error('Not implemented'); }
}

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';

export const dataService: DataService = isDemo ? new MockDataService() : new LiveDataService();
