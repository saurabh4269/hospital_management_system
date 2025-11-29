import type { ActionItem, DataService, HospitalNode, KPIMetrics } from '../types';
import { MockDataService } from './MockDataService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return (await res.json()) as T;
}

function mapBackendKPIMetrics(raw: any): KPIMetrics {
  const icu = typeof raw.icu_occupancy === 'number' ? raw.icu_occupancy : 0;
  const ward = typeof raw.ward_occupancy === 'number' ? raw.ward_occupancy : 0;
  const avgOccupancy = (icu + ward) / 2;

  return {
    occupancyRate: Math.round(avgOccupancy * 100),
    surgeConfidence: Math.round((raw.surge_confidence ?? 0) * 100),
    activeAlerts: raw.alert_count ?? 0,
    criticalHospitals: raw.critical_hospital_count ?? 0,
  };
}

function levelToPercent(level: string | undefined): number {
  switch (level) {
    case 'HIGH':
      return 90;
    case 'MEDIUM':
      return 60;
    case 'LOW':
    default:
      return 30;
  }
}

function mapBackendHospitalNode(raw: any): HospitalNode {
  const occ = raw.occupancy ?? {};
  const icuUsed = occ.icu_beds_used ?? 0;
  const icuTotal = occ.icu_beds_total ?? 0;
  const wardUsed = occ.ward_beds_used ?? 0;
  const wardTotal = occ.ward_beds_total ?? 0;
  const used = icuUsed + wardUsed;
  const total = icuTotal + wardTotal;
  const occupancyPct = total > 0 ? Math.round((used / total) * 100) : 0;

  const statusMap: Record<string, HospitalNode['status']> = {
    NORMAL: 'normal',
    WARNING: 'warning',
    CRITICAL: 'critical',
  };
  const status = statusMap[raw.status] ?? 'normal';

  const resourcesRaw = raw.resources ?? {};
  const criticalityGuess =
    typeof raw.criticality === 'number'
      ? raw.criticality
      : status === 'critical'
      ? 0.9
      : status === 'warning'
      ? 0.6
      : 0.2;

  return {
    id: raw.id,
    name: raw.name,
    lat: raw.lat,
    lng: raw.lng,
    occupancy: occupancyPct,
    status,
    criticality: criticalityGuess,
    resources: {
      oxygen: levelToPercent(resourcesRaw.oxygen),
      staff: levelToPercent(resourcesRaw.staff_load),
      beds: 100 - occupancyPct,
    },
  };
}

function mapBackendActionItem(raw: any): ActionItem {
  const typeMap: Record<string, ActionItem['type']> = {
    STAFFING: 'staff',
    SUPPLY: 'resource',
    ADVISORY: 'advisory',
  };
  const statusMap: Record<string, ActionItem['status']> = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  };

  const type = typeMap[raw.type] ?? 'advisory';
  const status = statusMap[raw.status] ?? 'pending';

  const template: string = raw.message_template ?? '';
  const title =
    raw.title ??
    ((template.length > 80 ? `${template.slice(0, 77)}...` : template) ||
      'Action');
  const description = raw.description ?? template ?? '';

  const timestamp: string =
    raw.updated_at ?? raw.created_at ?? new Date().toISOString();

  const severity: ActionItem['severity'] =
    raw.severity === 'low' || raw.severity === 'medium' || raw.severity === 'high'
      ? raw.severity
      : 'medium';

  return {
    id: raw.id,
    type,
    title,
    description,
    status,
    timestamp,
    severity,
    payload: {
      target: raw.target,
      channel: raw.channel,
      recipients: raw.recipients,
      original: raw,
    },
  };
}

// Live HTTP-backed implementation
class LiveDataService implements DataService {
  async getHospitalNodes(): Promise<HospitalNode[]> {
    const raw = await http<any[]>('/api/hospitals');
    return raw.map(mapBackendHospitalNode);
  }

  async getPendingActions(): Promise<ActionItem[]> {
    const raw = await http<any[]>('/api/actions/pending');
    return raw.map(mapBackendActionItem);
  }

  async getKPIMetrics(): Promise<KPIMetrics> {
    const raw = await http<any>('/api/dashboard/kpi');
    return mapBackendKPIMetrics(raw);
  }

  async approveAction(id: string, payload?: any): Promise<void> {
    const messageOverride =
      payload?.messageOverride ??
      payload?.message ??
      (typeof payload === 'string' ? payload : undefined) ??
      null;

    await http(`/api/actions/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ message_override: messageOverride }),
    });
  }

  async rejectAction(id: string): Promise<void> {
    await http(`/api/actions/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason: null }),
    });
  }

  async generateAdvisory(prompt: string): Promise<string> {
    const raw = await http<{ draft: string }>('/api/advisory/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    return raw.draft;
  }
}

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';

export const dataService: DataService = isDemo ? new MockDataService() : new LiveDataService();
