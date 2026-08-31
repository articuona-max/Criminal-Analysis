import React, { useState } from 'react';
import { 
  ShieldAlert, 
  X, 
  MapPin, 
  Share2, 
  FileCheck, 
  Activity, 
  ArrowUpRight, 
  TrendingUp, 
  Sparkles, 
  Compass, 
  Search,
  ExternalLink,
  Layers,
  Scale,
  AlertTriangle
} from 'lucide-react';
import { AnomalyRecord, CaseId, POLENode } from '../types';
import { REAL_ANOMALIES, REAL_CASE_PROFILES } from '../data/realCasesData';

interface AnomalyMapperModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCaseId: CaseId;
  onSelectCaseId: (caseId: CaseId) => void;
  onFocusNodeOnGraph: (nodeId: string) => void;
  onFocusNodeOnMap: (nodeId: string) => void;
  allNodes: POLENode[];
}

export const AnomalyMapperModal: React.FC<AnomalyMapperModalProps> = ({
  isOpen,
  onClose,
  selectedCaseId,
  onSelectCaseId,
  onFocusNodeOnGraph,
  onFocusNodeOnMap,
  allNodes
}) => {
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string>(REAL_ANOMALIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');

  if (!isOpen) return null;

  const currentCaseProfile = REAL_CASE_PROFILES.find(c => c.id === selectedCaseId) || REAL_CASE_PROFILES[0];

  const filteredAnomalies = REAL_ANOMALIES.filter(anom => {
    if (selectedCaseId !== 'CASE_ALL' && anom.case_id !== selectedCaseId) return false;
    if (filterSeverity !== 'ALL' && anom.severity !== filterSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        anom.title.toLowerCase().includes(q) ||
        anom.summary.toLowerCase().includes(q) ||
        anom.detected_mechanism.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeAnomaly = REAL_ANOMALIES.find(a => a.id === selectedAnomalyId) || filteredAnomalies[0] || REAL_ANOMALIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-6xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-2xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Real-World Case Anomaly & Evidence Mapper</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  {REAL_ANOMALIES.length} Verified Public Anomalies
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-dimensional forensic anomaly detection mapped from real CBI, NIA, FBI, and Europol court filings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Case Filter Tabs Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">Case Focus:</span>
            {REAL_CASE_PROFILES.map((c) => {
              const isSelected = selectedCaseId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onSelectCaseId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{c.shortTitle}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {c.id === 'CASE_ALL' ? REAL_ANOMALIES.length : REAL_ANOMALIES.filter(a => a.case_id === c.id).length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search within anomalies */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search anomalies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Modal Main Body: 2 Columns */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Anomaly List */}
          <div className="w-2/5 border-r border-slate-200 bg-slate-50/50 p-4 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span>DETECTED ANOMALY CLUSTERS ({filteredAnomalies.length})</span>
              <span>CONFIDENCE / SCORE</span>
            </div>

            {filteredAnomalies.map((anom) => {
              const isSelected = anom.id === activeAnomaly.id;
              const scorePct = Math.round(anom.anomaly_score * 100);

              return (
                <div
                  key={anom.id}
                  onClick={() => setSelectedAnomalyId(anom.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/15'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {anom.case_name}
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">
                      Score: {scorePct}%
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">{anom.title}</h3>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-2">
                    {anom.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                    <span className="font-semibold text-indigo-600 truncate max-w-[190px]">
                      {anom.type.replace(/_/g, ' ')}
                    </span>
                    <span className="text-slate-400 font-medium">{anom.related_node_ids.length} Entities</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: In-Depth Anomaly Forensic Breakdown & Mapping Controls */}
          <div className="flex-1 bg-white p-6 overflow-y-auto space-y-5">
            {activeAnomaly ? (
              <>
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
                        {activeAnomaly.case_name}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-700">
                        {activeAnomaly.severity} SEVERITY
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{activeAnomaly.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Detection Engine: <span className="font-semibold text-slate-700">{activeAnomaly.detected_mechanism}</span>
                    </p>
                  </div>

                  {/* Action Buttons to Map & Pinpoint */}
                  <div className="flex items-center gap-2">
                    {activeAnomaly.related_node_ids[0] && (
                      <button
                        onClick={() => {
                          onFocusNodeOnGraph(activeAnomaly.related_node_ids[0]);
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Map in Graph</span>
                      </button>
                    )}

                    {activeAnomaly.map_coordinates && activeAnomaly.related_node_ids[0] && (
                      <button
                        onClick={() => {
                          onFocusNodeOnMap(activeAnomaly.related_node_ids[0]);
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Pinpoint on Map</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {activeAnomaly.key_metric_label}
                    </span>
                    <span className="text-sm font-bold font-mono text-rose-600">
                      {activeAnomaly.key_metric_value}
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Mathematical Anomaly Score
                    </span>
                    <span className="text-sm font-bold font-mono text-indigo-600">
                      {(activeAnomaly.anomaly_score * 100).toFixed(1)} / 100
                    </span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Legal Admissibility
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <FileCheck className="w-3.5 h-3.5 shrink-0" />
                      Certified Sec 65B
                    </span>
                  </div>
                </div>

                {/* Summary & Narrative */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Investigative Anomaly Breakdown
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {activeAnomaly.summary}
                  </p>
                </div>

                {/* Evidentiary Proof from Public Records */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                    <Scale className="w-4 h-4 text-amber-700" />
                    <span>Public Court Record & Evidentiary Proof</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    {activeAnomaly.evidentiary_proof}
                  </p>
                  <p className="text-[11px] text-amber-700 font-semibold pt-1 border-t border-amber-200/60">
                    Jurisdiction Citation: {activeAnomaly.court_admissibility}
                  </p>
                </div>

                {/* Associated POLE Entities */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Connected Real Entities in Anomaly Subgraph ({activeAnomaly.related_node_ids.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeAnomaly.related_node_ids.map((nid) => {
                      const node = allNodes.find(n => n.id === nid);
                      if (!node) return null;

                      return (
                        <div
                          key={nid}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors"
                        >
                          <div className="truncate mr-2">
                            <span className="text-[10px] font-bold text-indigo-600 block">{node.type}</span>
                            <span className="text-xs font-bold text-slate-900 truncate block">{node.label}</span>
                          </div>
                          <button
                            onClick={() => {
                              onFocusNodeOnGraph(node.id);
                              onClose();
                            }}
                            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline shrink-0"
                          >
                            Inspect →
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Map Pinpoint Preview if coords exist */}
                {activeAnomaly.map_coordinates && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <div>
                        <span className="font-bold text-slate-800">{activeAnomaly.map_coordinates.location_name}</span>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          GPS: {activeAnomaly.map_coordinates.lat.toFixed(4)}° N, {activeAnomaly.map_coordinates.lng.toFixed(4)}° E
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onFocusNodeOnMap(activeAnomaly.related_node_ids[0]);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition-colors"
                    >
                      Fly to Coordinates
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Select an anomaly to view full forensic dossier.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
