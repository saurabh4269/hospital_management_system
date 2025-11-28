import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import type { KPIMetrics } from '@/types';

interface MetricDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: {
    label: string;
    value: string | number;
    trend: number;
    type: keyof KPIMetrics;
  } | null;
}

export function MetricDetailModal({ isOpen, onClose, metric }: MetricDetailModalProps) {
  if (!metric) return null;

  const getContextualAnalysis = (type: string) => {
    switch (type) {
      case 'avgOccupancy':
        return {
          reason: "Diwali festival approaching",
          impact: "Expected 15% increase in burn cases and respiratory issues.",
          severity: "high"
        };
      case 'avgWaitTime':
        return {
          reason: "Staff shortage in Triage",
          impact: "Patient queue building up during peak hours.",
          severity: "medium"
        };
      case 'criticalAlerts':
        return {
          reason: "Multiple critical incidents reported",
          impact: "High load on emergency response teams.",
          severity: "critical"
        };
      default:
        return {
          reason: "Routine monitoring",
          impact: "System operating within normal parameters.",
          severity: "low"
        };
    }
  };

  const getActionableInsights = (type: string) => {
    switch (type) {
      case 'avgOccupancy':
        return [
          { id: 1, action: "Deploy extra staff to Burn Ward", type: "deployment" },
          { id: 2, action: "Open reserve beds in Ward C", type: "resource" }
        ];
      case 'avgWaitTime':
        return [
          { id: 1, action: "Reassign 2 nurses to Triage", type: "deployment" },
          { id: 2, action: "Activate fast-track protocol", type: "process" }
        ];
      default:
        return [
          { id: 1, action: "Continue monitoring", type: "observation" }
        ];
    }
  };

  const analysis = getContextualAnalysis(metric.type);
  const insights = getActionableInsights(metric.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#09090b] border-[#27272a] text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Activity className="w-5 h-5 text-emerald-400" />
            {metric.label} Analysis
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Real-time deep dive and autonomous recommendations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current State */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <p className="text-sm text-zinc-400">Current Value</p>
              <p className="text-3xl font-bold font-mono text-white">{metric.value}</p>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${metric.trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              <TrendingUp className="w-4 h-4" />
              {metric.trend > 0 ? '+' : ''}{metric.trend}%
            </div>
          </div>

          {/* Contextual Analysis */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Contextual Analysis
            </h4>
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Driver</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                  analysis.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                  analysis.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {analysis.severity} Impact
                </span>
              </div>
              <p className="text-sm text-zinc-200 font-medium">{analysis.reason}</p>
              <p className="text-xs text-zinc-400">{analysis.impact}</p>
            </div>
          </div>

          {/* Actionable Insights */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Recommended Actions
            </h4>
            <div className="space-y-2">
              {insights.map((insight) => (
                <div key={insight.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-sm text-zinc-300">{insight.action}</span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 gap-1">
                    Trigger
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
