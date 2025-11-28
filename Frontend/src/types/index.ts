export interface HospitalNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  occupancy: number; // 0-100
  status: 'normal' | 'warning' | 'critical';
  criticality?: number; // 0-1 (0 = low, 1 = extreme)
  resources: {
    oxygen: number; // 0-100
    staff: number; // 0-100
    beds: number; // 0-100
  };
}

export interface ActionItem {
  id: string;
  type: 'staff' | 'resource' | 'advisory';
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  payload?: any;
}

export interface KPIMetrics {
  occupancyRate: number;
  surgeConfidence: number;
  activeAlerts: number;
  criticalHospitals: number;
}

export interface DataService {
  getHospitalNodes(): Promise<HospitalNode[]>;
  getPendingActions(): Promise<ActionItem[]>;
  getKPIMetrics(): Promise<KPIMetrics>;
  approveAction(id: string, payload?: any): Promise<void>;
  rejectAction(id: string): Promise<void>;
  generateAdvisory(prompt: string): Promise<string>;
}
