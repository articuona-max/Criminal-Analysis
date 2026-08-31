import React from 'react';
import { 
  Filter, 
  Layers, 
  ShieldAlert, 
  Users, 
  RotateCcw, 
  Sparkles, 
  Zap, 
  Activity,
  CheckSquare,
  Square
} from 'lucide-react';
import { POLEType } from '../types';
import { GraphFilterCriteria } from '../data/intelligenceEngine';

interface NodeFilterProps {
  filterCriteria: GraphFilterCriteria;
  setFilterCriteria: React.Dispatch<React.SetStateAction<GraphFilterCriteria>>;
  totalNodesCount: number;
  filteredNodesCount: number;
  totalEdgesCount: number;
  filteredEdgesCount: number;
}

export const NodeFilter: React.FC<NodeFilterProps> = ({
  filterCriteria,
  setFilterCriteria,
  totalNodesCount,
  filteredNodesCount,
  totalEdgesCount,
  filteredEdgesCount,
}) => {
  const poleTypesList: { type: POLEType; label: string; color: string }[] = [
    { type: 'Person', label: 'People / Suspects', color: '#f43f5e' },
    { type: 'Phone', label: 'Phones / Burners', color: '#06b6d4' },
    { type: 'Account', label: 'Bank Accounts', color: '#10b981' },
    { type: 'Vehicle', label: 'Vehicles / Haulers', color: '#f59e0b' },
    { type: 'Location', label: 'Locations / Ports', color: '#8b5cf6' },
    { type: 'Organization', label: 'Shell Companies', color: '#4f46e5' },
    { type: 'Event', label: 'FIRs & Seizures', color: '#ef4444' },
  ];

  const handleTogglePoleType = (type: POLEType) => {
    setFilterCriteria(prev => {
      const exists = prev.poleTypes.includes(type);
      const updated = exists
        ? prev.poleTypes.filter(t => t !== type)
        : [...prev.poleTypes, type];
      return { ...prev, poleTypes: updated };
    });
  };

  const handleSelectAllPole = () => {
    setFilterCriteria(prev => ({
      ...prev,
      poleTypes: ['Person', 'Phone', 'Account', 'Vehicle', 'Location', 'Organization', 'Event']
    }));
  };

  const handleResetFilters = () => {
    setFilterCriteria({
      poleTypes: ['Person', 'Phone', 'Account', 'Vehicle', 'Location', 'Organization', 'Event'],
      minRisk: 0,
      communityId: 'ALL',
      highBrokersOnly: false,
      anomaliesOnly: false,
      structuringOnly: false,
      selectedNodeId: null,
      egoRadius: 0,
      searchQuery: '',
    });
  };

  return (
    <div className="w-full bg-white border-r border-slate-200 p-5 text-xs text-slate-700 overflow-y-auto space-y-5 h-full">
      
      {/* Header & Subgraph Counter */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 tracking-tight text-xs uppercase">
            Domain Filters
          </h3>
        </div>
        <button
          onClick={handleResetFilters}
          className="text-[11px] text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Subgraph Metrics Gauge */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block mb-1">
          Active Subgraph Density
        </span>
        <div className="flex justify-between font-mono text-xs font-semibold text-slate-800">
          <span>Nodes: <strong className="text-indigo-600 font-bold">{filteredNodesCount}</strong> / {totalNodesCount}</span>
          <span>Edges: <strong className="text-emerald-600 font-bold">{filteredEdgesCount}</strong> / {totalEdgesCount}</span>
        </div>
      </div>

      {/* POLE Domain Checkboxes */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
            Entity Domains
          </span>
          <button
            onClick={handleSelectAllPole}
            className="text-[11px] text-indigo-600 hover:underline font-medium"
          >
            Select All
          </button>
        </div>
        <div className="space-y-1">
          {poleTypesList.map(({ type, label, color }) => {
            const isChecked = filterCriteria.poleTypes.includes(type);
            return (
              <label
                key={type}
                onClick={() => handleTogglePoleType(type)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer select-none transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-slate-700 font-medium">{label}</span>
                </div>
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-300" />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Minimum Risk Threshold Slider */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider">
            Minimum Risk Score
          </span>
          <span className="font-mono font-bold text-rose-600">
            ≥ {filterCriteria.minRisk} / 100
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="95"
          step="5"
          value={filterCriteria.minRisk}
          onChange={(e) => setFilterCriteria(prev => ({ ...prev, minRisk: Number(e.target.value) }))}
          className="w-full accent-rose-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
          <span>All (0)</span>
          <span>High (70+)</span>
          <span>Critical (85+)</span>
        </div>
      </div>

      {/* Louvain Community Syndicate Cells */}
      <div className="pt-2 border-t border-slate-100">
        <span className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider block mb-1.5">
          Syndicate Cells (Louvain)
        </span>
        <select
          value={filterCriteria.communityId}
          onChange={(e) => {
            const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
            setFilterCriteria(prev => ({ ...prev, communityId: val }));
          }}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
        >
          <option value="ALL">All Operational Syndicate Cells</option>
          <option value="1">Cell 1: Apex Leadership (Dubai-Mumbai)</option>
          <option value="2">Cell 2: Hawala Bullion Channel (Delhi)</option>
          <option value="3">Cell 3: Maritime Logistics & Offload</option>
        </select>
      </div>

      {/* Quick Intelligence Filters */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider block">
          AI & Topology Filters
        </span>

        {/* High Broker / Betweenness */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-xs text-slate-700 font-medium">Master Brokers (Betweenness ≥ 0.2)</span>
          </div>
          <input
            type="checkbox"
            checked={filterCriteria.highBrokersOnly}
            onChange={(e) => setFilterCriteria(prev => ({ ...prev, highBrokersOnly: e.target.checked }))}
            className="accent-indigo-600 rounded"
          />
        </label>

        {/* GAE Anomalies */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="text-xs text-slate-700 font-medium">GAE Neural Anomalies (≥ 0.6)</span>
          </div>
          <input
            type="checkbox"
            checked={filterCriteria.anomaliesOnly}
            onChange={(e) => setFilterCriteria(prev => ({ ...prev, anomaliesOnly: e.target.checked }))}
            className="accent-indigo-600 rounded"
          />
        </label>

        {/* Smurfing / Structuring */}
        <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs text-slate-700 font-medium">Smurfing & Structuring Accounts</span>
          </div>
          <input
            type="checkbox"
            checked={filterCriteria.structuringOnly}
            onChange={(e) => setFilterCriteria(prev => ({ ...prev, structuringOnly: e.target.checked }))}
            className="accent-indigo-600 rounded"
          />
        </label>
      </div>

      {/* Ego-Network Depth */}
      <div className="pt-2 border-t border-slate-100">
        <span className="font-semibold text-slate-900 text-[11px] uppercase tracking-wider block mb-1.5">
          Ego-Network Neighborhood
        </span>
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-center">
          <button
            onClick={() => setFilterCriteria(prev => ({ ...prev, egoRadius: 0 }))}
            className={`py-1 rounded-lg text-[11px] font-medium transition-all ${
              filterCriteria.egoRadius === 0
                ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Global
          </button>
          <button
            onClick={() => setFilterCriteria(prev => ({ ...prev, egoRadius: 1 }))}
            className={`py-1 rounded-lg text-[11px] font-medium transition-all ${
              filterCriteria.egoRadius === 1
                ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1-Hop
          </button>
          <button
            onClick={() => setFilterCriteria(prev => ({ ...prev, egoRadius: 2 }))}
            className={`py-1 rounded-lg text-[11px] font-medium transition-all ${
              filterCriteria.egoRadius === 2
                ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2-Hop
          </button>
        </div>
      </div>

    </div>
  );
};
