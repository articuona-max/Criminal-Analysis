import React from 'react';
import { 
  Bell, 
  ShieldAlert, 
  AlertTriangle, 
  Zap, 
  CheckCircle2, 
  Eye, 
  X,
  Clock,
  Database
} from 'lucide-react';
import { AlertItem, POLENode } from '../types';

interface AlertPanelProps {
  alerts: AlertItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectAlert: (alert: AlertItem) => void;
  allNodes: POLENode[];
}

export const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  isOpen,
  onClose,
  onSelectAlert,
  allNodes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200 p-5 text-xs text-slate-800 shadow-2xl z-40 flex flex-col justify-between animate-in fade-in slide-in-from-right-4">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 tracking-tight text-sm">
                Tactical Alerts
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {alerts.filter(a => a.status === 'UNRESOLVED').length} Unresolved Alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alert Cards List */}
        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => onSelectAlert(alert)}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-400 cursor-pointer transition-all hover:bg-white hover:shadow-sm space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  alert.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  alert.severity === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {alert.severity} // {alert.category}
                </span>

                <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                {alert.title}
              </h4>

              <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                {alert.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px]">
                <span className="text-slate-500 font-medium">{alert.source_pipeline}</span>
                <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  Inspect Subgraph →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>Zero-Trust Audit Stream Active</span>
        <button
          onClick={() => alert('All alerts marked as reviewed by investigator.')}
          className="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          Acknowledge All
        </button>
      </div>

    </div>
  );
};
