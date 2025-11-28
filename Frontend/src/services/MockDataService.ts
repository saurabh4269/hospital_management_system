import type { ActionItem, DataService, HospitalNode, KPIMetrics } from '../types';

const MOCK_HOSPITALS: HospitalNode[] = [
  {
    id: 'h1',
    name: 'Central City Hospital',
    lat: 19.0760,
    lng: 72.8777,
    occupancy: 85,
    status: 'warning',
    criticality: 0.65,
    resources: { oxygen: 45, staff: 60, beds: 15 }
  },
  {
    id: 'h2',
    name: 'South Bombay Medical Center',
    lat: 18.9220,
    lng: 72.8347,
    occupancy: 92,
    status: 'critical',
    criticality: 0.95,
    resources: { oxygen: 20, staff: 40, beds: 8 }
  },
  {
    id: 'h3',
    name: 'Suburban General',
    lat: 19.1136,
    lng: 72.8697,
    occupancy: 45,
    status: 'normal',
    criticality: 0.2,
    resources: { oxygen: 80, staff: 90, beds: 55 }
  },
  {
    id: 'h4',
    name: 'Navi Mumbai Care',
    lat: 19.0330,
    lng: 73.0297,
    occupancy: 78,
    status: 'warning',
    criticality: 0.55,
    resources: { oxygen: 60, staff: 75, beds: 22 }
  },
  {
    id: 'h5',
    name: 'Thane District Hospital',
    lat: 19.2183,
    lng: 72.9781,
    occupancy: 30,
    status: 'normal',
    criticality: 0.1,
    resources: { oxygen: 95, staff: 85, beds: 70 }
  },
  {
    id: 'h6',
    name: 'Andheri West Clinic',
    lat: 19.1197,
    lng: 72.8464,
    occupancy: 88,
    status: 'critical',
    criticality: 0.88,
    resources: { oxygen: 30, staff: 50, beds: 5 }
  }
];

const MOCK_ACTIONS: ActionItem[] = [
  {
    id: 'a1',
    type: 'staff',
    title: 'Urgent Staff Requirement',
    description: 'Requesting 5 additional nurses for ICU at South Bombay Medical Center due to sudden influx.',
    status: 'pending',
    timestamp: new Date().toISOString(),
    severity: 'high',
    payload: { hospitalId: 'h2', role: 'nurse', count: 5 }
  },
  {
    id: 'a2',
    type: 'resource',
    title: 'Low Oxygen Supply',
    description: 'Oxygen levels at Central City Hospital are below 50%. Order 50 cylinders immediately.',
    status: 'pending',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: 'medium',
    payload: { hospitalId: 'h1', item: 'oxygen_cylinder', count: 50 }
  },
  {
    id: 'a3',
    type: 'advisory',
    title: 'Viral Surge Detected',
    description: 'Abnormal spike in viral load detected in Andheri West sewage samples. Recommend localized masking.',
    status: 'pending',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    severity: 'high',
    payload: { location: 'Andheri West', type: 'containment' }
  },
  {
    id: 'a4',
    type: 'resource',
    title: 'Bed Availability Check',
    description: 'Routine check for bed availability in suburban wards. No immediate action required.',
    status: 'pending',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    severity: 'low',
    payload: { region: 'Suburban', type: 'audit' }
  },
  {
    id: 'a5',
    type: 'staff',
    title: 'Shift Rotation Alert',
    description: 'Night shift staff at Thane District Hospital are reporting fatigue. Consider early rotation.',
    status: 'pending',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    severity: 'medium',
    payload: { hospitalId: 'h5', type: 'scheduling' }
  }
];

export class MockDataService implements DataService {
  constructor() {
    if (import.meta.env.VITE_VERBOSE === 'true') {
      console.log('[DEMO MODE] MockDataService initialized');
    }
  }

  async getHospitalNodes(): Promise<HospitalNode[]> {
    this.log('Fetching hospital nodes');
    return new Promise(resolve => setTimeout(() => resolve(MOCK_HOSPITALS), 500));
  }

  async getPendingActions(): Promise<ActionItem[]> {
    this.log('Fetching pending actions');
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ACTIONS), 500));
  }

  async getKPIMetrics(): Promise<KPIMetrics> {
    this.log('Fetching KPI metrics');
    return new Promise(resolve => setTimeout(() => resolve({
      occupancyRate: 74,
      surgeConfidence: 88,
      activeAlerts: 12,
      criticalHospitals: 1
    }), 500));
  }

  async approveAction(id: string, payload?: any): Promise<void> {
    this.log(`Approving action ${id} with payload:`, payload);
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  async rejectAction(id: string): Promise<void> {
    this.log(`Rejecting action ${id}`);
    return new Promise(resolve => setTimeout(resolve, 500));
  }

  async generateAdvisory(prompt: string): Promise<string> {
    this.log(`Generating advisory for prompt: ${prompt}`);
    return new Promise(resolve => setTimeout(() => resolve(
      `DRAFT ADVISORY:\n\nBased on the scenario "${prompt}", we recommend the following measures:\n1. Increase public masking mandates.\n2. Close non-essential gatherings.\n3. Monitor air quality indices closely.`
    ), 1500));
  }

  private log(message: string, ...args: any[]) {
    if (import.meta.env.VITE_VERBOSE === 'true') {
      console.log(`[DEMO MODE] ${message}`, ...args);
    }
  }
}
