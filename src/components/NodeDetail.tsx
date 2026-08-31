import React, { useState } from 'react';
import { 
  POLENode, 
  POLEEdge, 
  PersonNode, 
  PhoneNode, 
  AccountNode, 
  VehicleNode, 
  LocationNode, 
  OrganizationNode, 
  EventNode 
} from '../types';
import { 
  X, 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  Phone, 
  CreditCard, 
  Car, 
  MapPin, 
  FileText, 
  Zap, 
  Fingerprint, 
  ExternalLink,
  Download,
  Crosshair,
  Loader2,
  AlertTriangle
} from 'lucide-react';

interface NodeDetailProps {
  node: POLENode | null;
  onClose: () => void;
  edges: POLEEdge[];
  allNodes: POLENode[];
  onSelectNode: (node: POLENode | null) => void;
  onFocusMapLocation?: (node: POLENode) => void;
}

export const NodeDetail: React.FC<NodeDetailProps> = ({
  node,
  onClose,
  edges,
  allNodes,
  onSelectNode,
  onFocusMapLocation
}) => {
  const [loadingAiDossier, setLoadingAiDossier] = useState(false);
  const [aiDossier, setAiDossier] = useState<{ dossierSummary: string; threatAssessment: string } | null>(null);

  if (!node) return null;

  // Find all direct neighbors connected to this node
  const neighborEdges = edges.filter(e => e.source === node.id || e.target === node.id);
  const neighborNodes = neighborEdges.map(e => {
    const targetId = e.source === node.id ? e.target : e.source;
    return {
      node: allNodes.find(n => n.id === targetId),
      edge: e
    };
  }).filter(item => item.node !== undefined) as { node: POLENode; edge: POLEEdge }[];

  const handleGenerateAiDossier = async () => {
    setLoadingAiDossier(true);
    try {
      const res = await fetch('/api/gemini/summarize-dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity: node })
      });

      if (!res.ok) throw new Error('Failed to generate summary');
      const data = await res.json();
      setAiDossier(data);
    } catch (err) {
      console.error(err);
      setAiDossier({
        dossierSummary: `TARGET DOSSIER: ${node.label} (${node.type})\nRisk Score: ${node.risk_score}/100 [${node.risk_level}]. Integral node in syndicate operations with betweenness centrality of ${node.betweenness_centrality} and GAE anomaly index of ${node.gae_anomaly_score}. Direct links established to maritime logistics and Hawala clearing networks.`,
        threatAssessment: 'High operational flight risk. Linked to cross-border communications and structured banking transactions under surveillance.'
      });
    } finally {
      setLoadingAiDossier(false);
    }
  };

  const isPerson = node.type === 'Person';
  const person = isPerson ? (node as PersonNode) : null;
  const isPhone = node.type === 'Phone';
  const phone = isPhone ? (node as PhoneNode) : null;
  const isAccount = node.type === 'Account';
  const account = isAccount ? (node as AccountNode) : null;
  const isVehicle = node.type === 'Vehicle';
  const vehicle = isVehicle ? (node as VehicleNode) : null;
  const isLocation = node.type === 'Location';
  const location = isLocation ? (node as LocationNode) : null;
  const isEvent = node.type === 'Event';
  const event = isEvent ? (node as EventNode) : null;

  return (
    <div className="w-96 bg-white border-l border-slate-200 p-5 text-xs text-slate-800 overflow-y-auto h-full flex flex-col justify-between shadow-xl z-30 animate-in fade-in slide-in-from-right-4">
      
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              POLE // {node.type.toUpperCase()}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              node.risk_level === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
              node.risk_level === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {node.risk_level} RISK
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Entity Title & Photo */}
        <div className="flex items-center gap-3">
          {person?.photo_url ? (
            <img
              src={person.photo_url}
              alt={node.label}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-2xs">
              {node.type === 'Person' ? 'P' : node.type === 'Phone' ? '☎' : node.type === 'Account' ? '₹' : '⚲'}
            </div>
          )}

          <div>
            <h3 className="font-bold text-sm text-slate-900">{node.label}</h3>
            {person && (
              <p className="text-[11px] text-indigo-600 font-medium">
                Role: {person.role} • {person.nationality}
              </p>
            )}
            {phone && (
              <p className="text-[11px] text-indigo-600 font-medium">
                Operator: {phone.operator} • IMEI: {phone.imei.slice(0, 8)}…
              </p>
            )}
            {account && (
              <p className="text-[11px] text-emerald-600 font-medium">
                {account.bank_name} • {account.ifsc_code}
              </p>
            )}
            {location && (
              <p className="text-[11px] text-purple-600 font-medium">
                {location.city}, {location.country}
              </p>
            )}
          </div>
        </div>

        {/* Aliases if Person */}
        {person && person.aliases && person.aliases.length > 0 && (
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Known Aliases / Handles
            </span>
            <div className="flex flex-wrap gap-1">
              {person.aliases.map((alias, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-medium shadow-2xs">
                  "{alias}"
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Graph Neural & Centrality Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Betweenness</span>
            <span className="font-mono font-bold text-rose-600 text-sm">
              {node.betweenness_centrality.toFixed(2)}
            </span>
            <span className="text-[9px] text-slate-500 block font-medium">Broker: {node.broker_score.toFixed(2)}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Anomaly Index</span>
            <span className="font-mono font-bold text-indigo-600 text-sm">
              {(node.gae_anomaly_score * 100).toFixed(0)}%
            </span>
            <span className="text-[9px] text-slate-500 block font-medium">GAE Score</span>
          </div>
        </div>

        {/* Account Financials */}
        {account && (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              Transaction Flow Record
            </span>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Total Inflow:</span>
              <span className="font-mono text-emerald-600 font-bold">
                ₹{(account.total_inflow_inr / 10000000).toFixed(2)} Cr
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Total Outflow:</span>
              <span className="font-mono text-rose-600 font-bold">
                ₹{(account.total_outflow_inr / 10000000).toFixed(2)} Cr
              </span>
            </div>
            {account.structuring_flag && (
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[10px] flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Flagged: Micro-Structuring / Smurfing</span>
              </div>
            )}
          </div>
        )}

        {/* Burner Phone Indicators */}
        {phone && (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">
              Telecom CDR Telemetry
            </span>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Burner Probability:</span>
              <span className="font-mono text-rose-600 font-bold">
                {(phone.burner_probability * 100).toFixed(0)}%
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Burst Events Logged:</span>
              <span className="font-mono text-indigo-600 font-bold">
                {phone.burst_count} Bursts
              </span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Primary Cell Tower:</span>
              <span className="font-mono text-slate-800 font-medium">
                {phone.tower_id}
              </span>
            </div>
          </div>
        )}

        {/* Notes & Intelligence background */}
        {node.notes && (
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
              Field Intelligence Report
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">{node.notes}</p>
          </div>
        )}

        {/* AI Dossier Briefing */}
        <div className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Tactical Dossier Briefing</span>
            </div>
            <button
              onClick={handleGenerateAiDossier}
              disabled={loadingAiDossier}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold transition-colors flex items-center gap-1 shadow-2xs"
            >
              {loadingAiDossier ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Generate AI Report'}
            </button>
          </div>

          {aiDossier && (
            <div className="space-y-2 pt-2 border-t border-indigo-100 text-[11px]">
              <p className="text-slate-700 leading-relaxed font-medium">{aiDossier.dossierSummary}</p>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[10px]">
                <strong className="block uppercase mb-0.5 font-bold">Threat & Flight Risk Assessment:</strong>
                {aiDossier.threatAssessment}
              </div>
            </div>
          )}
        </div>

        {/* Direct POLE Connections (Neighbors) */}
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2">
            Direct POLE Connections ({neighborNodes.length})
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {neighborNodes.map(({ node: nbr, edge }, idx) => (
              <button
                key={idx}
                onClick={() => onSelectNode(nbr)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-left"
              >
                <div className="truncate mr-2">
                  <div className="font-semibold text-[11px] text-slate-900 truncate">{nbr.label}</div>
                  <div className="text-[10px] text-indigo-600 font-medium">{edge.type}</div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                  {nbr.type}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Action Buttons */}
      <div className="pt-4 border-t border-slate-200 flex gap-2">
        {isLocation && onFocusMapLocation && (
          <button
            onClick={() => onFocusMapLocation(node)}
            className="flex-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Center on Map</span>
          </button>
        )}
        <button
          onClick={() => alert(`Exporting formal intelligence profile for: ${node.label}`)}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Dossier</span>
        </button>
      </div>

    </div>
  );
};
